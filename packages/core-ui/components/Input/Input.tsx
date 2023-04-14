import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface InputProps {}

const StyledInput = styled.div`
  color: pink;
`;

export function Input(props: InputProps) {
  return (
    <StyledInput>
      <h1>Welcome to Input!</h1>
    </StyledInput>
  );
}

export default Input;
