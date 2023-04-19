import React from 'react';
import styled from '@emotion/styled';
import Core from '../../layout/Core';
import { Box } from 'packages/core-ui/components/Box/Box';
import { inject, observer } from 'mobx-react';
const StyledPage = styled.div`
  .page {
  }
`;

export function Index(props) {
  return (
    <Core>
      <Box>Hello World</Box>
    </Core>
  );
}

export default inject('store')(observer(Index));
