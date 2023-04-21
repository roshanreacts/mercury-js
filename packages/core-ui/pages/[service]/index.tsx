import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import Core from '../../layout/Core';
import { Box } from 'packages/core-ui/components/Box/Box';
import { inject, observer } from 'mobx-react';
import { useRouter } from 'next/router';

export function Index({ store: { applications } }) {
  const router = useRouter();
  useEffect(() => {
    applications.setSelectedApp(router.query.service);
  }, [router.query.service]);
  return (
    <Core>
      <Box>{applications.selectedApp?.name || 'Hello World'}</Box>
    </Core>
  );
}

export default inject('store')(observer(Index));
