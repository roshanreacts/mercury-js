import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import Core from '../../layout/Core';
import { Box } from 'packages/core-ui/components/Box';
import { client, initializeStore } from '../../store';
import { inject, observer } from 'mobx-react';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { getSnapshot } from 'mobx-state-tree';

export async function getServerSideProps(context) {
  console.log('context', context.query);
  if (isNaN(Number(context.query.service))) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const { data } = await client.query({
    query: gql`
      query allPagesByService($service: Int!) {
        allPagesByService(service: $service) {
          id
          name
          icon
          slug
          serviceId
        }
      }
    `,
    variables: {
      service: Number(context.query.service),
    },
  });
  console.log('Pages data', data);
  return {
    props: {
      allPagesByService: data.allPagesByService,
    },
  };
}

export function Index({ allPagesByService, store }) {
  const router = useRouter();
  useEffect(() => {
    store.applications.setSelectedApp(router.query.service);
    store.pages.setPages(allPagesByService);

    console.log('allPagesByService', allPagesByService, store.pages.pages);
  }, [router]);
  return (
    <Core>
      <Box>{store.applications.selectedApp?.name || 'Hello World'}</Box>
      {store.pages.pages.map((page) => (
        <Box key={page.id}>{page.name || 'Hello World'}</Box>
      ))}
    </Core>
  );
}

export default inject('store')(observer(Index));
