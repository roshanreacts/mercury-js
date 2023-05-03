import { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { get } from 'lodash';
import { motion } from 'framer-motion';

type BoxProps = {
  variant?: keyof Theme['colors'];
  fgColor?: number | string;
  bgColor?: number | string;
  br?: number;
  m?: number;
  mt?: number;
  mr?: number;
  ml?: number;
  mb?: number;
  mx?: number;
  my?: number;
  p?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  px?: number;
  py?: number;
  width?: number;
  height?: number;
  elevation?: number;
};

type BoxStyles = {
  color: string;
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  margin: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  paddingRight: number;
  paddingLeft: number;
  paddingTop: number;
  paddingBottom: number;
  width: number;
  height: number;
  boxShadow: string;
};

function themeCompiler<T extends BoxProps & { theme: Theme }>(
  props: T,
  key: string
): string {
  const keyType = typeof props[key];
  return keyType === 'number'
    ? props.theme.colors[props.variant][props[key]]
    : props[key] != null && props[key].toString().includes('.')
    ? get(props.theme.colors, props[key])
    : props[key];
}

function boxStyled<T extends BoxProps & { theme: Theme }>(props: T): BoxStyles {
  const styles = {} as BoxStyles;
  if (props.fgColor) styles.color = themeCompiler(props, 'fgColor');
  if (props.bgColor) styles.backgroundColor = themeCompiler(props, 'bgColor');
  if (props.br) styles.borderRadius = props.theme.gutter * props.br;
  if (props.m) styles.margin = props.theme.gutter * props.m;
  if (props.mt) styles.marginTop = props.theme.gutter * props.mt;
  if (props.mr) styles.marginRight = props.theme.gutter * props.mr;
  if (props.ml) styles.marginLeft = props.theme.gutter * props.ml;
  if (props.mb) styles.marginBottom = props.theme.gutter * props.mb;
  if (props.mx) {
    styles.marginLeft = props.theme.gutter * props.mx;
    styles.marginRight = props.theme.gutter * props.mx;
  }
  if (props.my) {
    styles.marginTop = props.theme.gutter * props.my;
    styles.marginBottom = props.theme.gutter * props.my;
  }
  if (props.p) styles.padding = props.theme.gutter * props.p;
  if (props.pr) styles.paddingRight = props.theme.gutter * props.pr;
  if (props.pt) styles.paddingTop = props.theme.gutter * props.pt;
  if (props.pl) styles.paddingLeft = props.theme.gutter * props.pl;
  if (props.pb) styles.paddingBottom = props.theme.gutter * props.pb;
  if (props.px) {
    styles.paddingRight = props.theme.gutter * props.px;
    styles.paddingLeft = props.theme.gutter * props.px;
  }
  if (props.py) {
    styles.paddingBottom = props.theme.gutter * props.py;
    styles.paddingTop = props.theme.gutter * props.py;
  }
  if (props.width) styles.width = props.width;
  if (props.height) styles.height = props.height;
  if (props.elevation)
    styles.boxShadow = props.theme.elevations[props.elevation];
  return styles;
}
export const Box = styled.div<BoxProps>(boxStyled);

export const BoxAnimate = styled(motion.div)<BoxProps>(boxStyled);

Box.defaultProps = {
  variant: 'primary',
};

BoxAnimate.defaultProps = {
  variant: 'primary',
};
