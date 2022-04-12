import { CamelCase } from './camel-case';

export interface SwAuthConfig<CSSObject> {
  container: HTMLElement;
  containerStyles?: CSSObject;
}

export enum AttributesDefinitions {
  'use-button-options' = 'boolean',
  'disable-create-new-user' = 'boolean',
  'partner-key' = 'string',
  'use-dev' = 'boolean',
  'hide-button' = 'boolean',
}

type EnumKeys = keyof typeof AttributesDefinitions;
export type SwElementAttributes = { [key in EnumKeys]: unknown | boolean | string | number };
export type SwAttributes = {
  [K in keyof SwElementAttributes as CamelCase<K>]: SwElementAttributes[K];
};

export interface ShadowRootConfig<EmotionCache> {
  cache: EmotionCache;
  root: HTMLElement;
  shadowRoot: HTMLElement;
  mountPoint: HTMLElement;
}

export type AttributeCallbackFn = (name: string, value: string, newVal: string) => void;
export interface SwAuthButtonProps {
  attributes: SwAttributes;
  container: HTMLElement;
  setAttrCallback: (fn: AttributeCallbackFn) => void;
}
