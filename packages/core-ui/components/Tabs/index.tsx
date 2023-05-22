import * as Tabs from '@radix-ui/react-tabs';
import styled from '@emotion/styled';

export const TabsRoot = styled(Tabs.Root)((props) => ({
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  boxShadow: `0 2px 10px ${props.theme.colors.blackA[4]}`,
}));

export const TabsList = styled(Tabs.List)((props) => ({
  flexShrink: 0,
  display: 'flex',
  borderBottom: `1px solid ${props.theme.colors.primary[0]}`,
}));

export const TabsTrigger = styled(Tabs.Trigger)((props) => ({
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'white',
  padding: '0 20px',
  height: 45,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  lineHeight: 1,
  color: props.theme.colors.primary[8],
  userSelect: 'none',
  '&:first-of-type': { borderTopLeftRadius: 6 },
  '&:last-of-type': { borderTopRightRadius: 6 },
  '&:hover': { color: props.theme.colors.primary[10] },
  '&[data-state="active"]': {
    color: props.theme.colors.primary[0],
    boxShadow:
      'inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor, 0px 0px 30px -10px rgba(0,0,0,0.3)',
  },
  '&:focus': {
    position: 'relative',
    boxShadow: `0px 0px 30px -10px rgba(0,0,0,0.3)`,
  },
}));

export const TabsContent = styled(Tabs.Content)((props) => ({
  flexGrow: 1,
  padding: 20,
  backgroundColor: 'white',
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  outline: 'none',
  '&:focus': { boxShadow: `0 0 0 2px black` },
}));
