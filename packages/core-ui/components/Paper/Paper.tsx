import styled from '@emotion/styled';

export const elevations: { [x: number]: string } = {
  0: '0px 0px 0px 0px rgba(0,0,0)',
  1: '0px 0px 10px -3px rgba(0,0,0,0.2)',
  2: '0px 0px 15px -3px rgba(0,0,0,0.3)',
  3: '0px 0px 15px -3px rgba(0,0,0,0.3);',
  4: '0px 0px 20px -3px rgba(0,0,0,0.3)',
  5: '0px 0px 25px -3px rgba(0,0,0,0.3)',
  6: '0px 0px 30px -2px rgba(0,0,0,0.3)',
  7: '0px 0px 40px 1px rgba(0,0,0,0.3)',
  8: '0px 0px 50px 2px rgba(0,0,0,0.3)',
  9: '0px 0px 60px 3px rgba(0,0,0,0.3)',
  10: '0px 0px 70px 5px rgba(0,0,0,0.3)',
};

type PaperProps = {
  elevation?: number;
  gutter?: number;
};

export const Paper = styled.div<PaperProps>`
  padding: ${(props) => props.theme.gutter}px;
  border-radius: ${(props) => props.theme.gutter / 2}px;
  ${(props) => ({ margin: props.gutter * props.theme.gutter })};
  ${(props) => ({ boxShadow: elevations[props.elevation] })};
`;

Paper.defaultProps = {
  elevation: 1,
  gutter: 2,
};
