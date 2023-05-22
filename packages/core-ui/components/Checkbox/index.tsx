import * as Checkbox from '@radix-ui/react-checkbox';
import styled from '@emotion/styled';

export const CheckboxRoot = styled(Checkbox.Root)((props) => ({
  all: 'unset',
  backgroundColor: 'white',
  width: 25,
  height: 25,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 2px 10px ${props.theme.colors.blackA[7]}`,
  '&:hover': { backgroundColor: props.theme.colors.primary[3] },
  '&:focus': { boxShadow: `0 0 0 2px black` },
}));

export const CheckboxIndicator = styled(Checkbox.Indicator)((props) => ({
  color: props.theme.colors.primary[0],
}));
