import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface DialogProps {}

const StyledDialog = styled.div`
  color: pink;
`;

export function Dialog(props: DialogProps) {
  return (
    <StyledDialog>
      <h1>Welcome to Dialog!</h1>
    </StyledDialog>
  );
}

export default Dialog;
