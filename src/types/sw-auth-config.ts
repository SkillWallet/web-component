import { EmotionCache } from '@emotion/cache';
import { CSSObject } from '@emotion/react';

export interface SwAuthConfig {
  container: HTMLElement | JSX.Element | any;
  containerStyles?: CSSObject;
}

export interface ShadowRootConfig {
  cache: EmotionCache;
  root: HTMLElement;
  shadowRoot: HTMLElement;
  mountPoint: HTMLElement;
}
