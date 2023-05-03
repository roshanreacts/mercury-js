import styled from '@emotion/styled';

export const Button = styled.button`
  color: ${(props) => props.theme.colors.whiteA[12]};
  padding: 10px 15px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.primary[0]};
  box-shadow: 0 0 0 1px ${(props) => props.theme.colors.primary[11]};
  :hover {
    transition-duration: 0.1s;
    background-color: ${(props) => props.theme.colors.primary[11]};
  }
  :active {
    transition-duration: 0.1s;
    top: 1px;
    box-shadow: none;
  }
`;
