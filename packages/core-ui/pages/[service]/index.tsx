import { useEffect, useState } from 'react';
import Core from '../../layout/Core';
import { Box } from '../../components/Box';
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '../../components/Tabs';
import { client } from '../../store';
import { inject, observer } from 'mobx-react';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
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
  return {
    props: {
      allPagesByService: data.allPagesByService,
    },
  };
}

export function Service({ allPagesByService, store: { applications, pages } }) {
  const router = useRouter();
  useEffect(() => {
    applications.setSelectedApp(router.query.service);
    pages.setPages(allPagesByService);
  }, [router]);
  return (
    <Core>
      <Box>{applications.selectedApp?.name || 'Hello World'}</Box>
      <TabsRoot>
        <TabsList aria-label="pages">
          {pages.pages.map((page) => (
            <TabsTrigger value={page.slug} key={page.id}>
              {page.name || 'Hello World'}
            </TabsTrigger>
          ))}
        </TabsList>
        {pages.pages.map((page) => (
          <TabsContent value={page.slug} key={page.id}>
            {JSON.stringify(page)}
          </TabsContent>
        ))}
      </TabsRoot>
    </Core>
  );
}

export default inject('store')(observer(Service));
