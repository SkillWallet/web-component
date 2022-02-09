import createCache from '@emotion/cache';
import { ShadowRootConfig } from '../types/sw-auth-config';

export const createShadowElement = ({ container, className }): ShadowRootConfig => {
  const shadowRoot = container.attachShadow({ mode: 'open' });
  const emotionRoot = document.createElement('style');

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css?family=Josefin+Sans';
  fontLink.rel = 'stylesheet';
  fontLink.type = 'text/css';

  const mountPoint = document.createElement('div');
  mountPoint.classList.add(className);

  const root = shadowRoot.appendChild(mountPoint);
  shadowRoot.insertBefore(fontLink, mountPoint);
  shadowRoot.insertBefore(emotionRoot, mountPoint);

  const cache = createCache({
    key: 'css',
    prepend: true,
    container: emotionRoot,
  });

  return {
    cache,
    root,
    shadowRoot,
    mountPoint,
  };
};

export const extractAttributes = (nodeMap) => {
  if (!nodeMap.attributes) {
    return {};
  }

  const obj = {};
  let attribute;
  const attributesAsNodeMap = [...nodeMap.attributes];
  console.log(attributesAsNodeMap);
  const attributes = attributesAsNodeMap.map((attr) => {
    return { [attr.name]: attr.value };
  });

  for (attribute of attributes) {
    const key = Object.keys(attribute)[0];
    const camelCasedKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    obj[camelCasedKey] = attribute[key];
  }

  return obj;
};

export const isElement = (obj: HTMLElement) => {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object';
  }
};
