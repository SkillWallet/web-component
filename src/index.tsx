/* eslint-disable class-methods-use-this */
import { MemoryRouter as Router } from 'react-router-dom';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import createCache from '@emotion/cache';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SwTheme } from './theme';
import store from './store/store';
import { EventsHandlerWrapper } from './components/EventsHandlerWrapper';
import SwAuth from './SwAuth';
import { SwAuthConfig } from './types/sw-auth-config';

const extractAttributes = (nodeMap) => {
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

const TAG_NAME = 'sw-auth';

export const InitSwAuth = (config: SwAuthConfig = null) => {
  customElements.define(
    TAG_NAME,
    class extends HTMLElement {
      static get observedAttributes() {
        // Add all tracked attributes to this array
        return ['hide-button'];
      }

      // eslint-disable-next-line class-methods-use-this
      attributeChangedCallback(name, oldValue, newValue) {
        console.log('CALLBACK CALLED');
        // @ts-ignore
        if (this.childAttrCalback) this.childAttrCalback(name, oldValue, newValue);
      }

      setAttributeChangeCallback = (callBack) => {
        // @ts-ignore
        if (callBack) this.childAttrCalback = callBack;
      };

      connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const emotionRoot = document.createElement('style');

        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css?family=Josefin+Sans';
        fontLink.rel = 'stylesheet';
        fontLink.type = 'text/css';

        // root
        const mountPoint = document.createElement('div');
        mountPoint.classList.add('sw-auth');

        // popups/popovers
        const rootContainer = config.container || document.createElement('div');
        rootContainer.classList.add('sw-auth-container');

        const reactRoot = shadowRoot.appendChild(mountPoint);

        shadowRoot.insertBefore(fontLink, mountPoint);
        shadowRoot.insertBefore(emotionRoot, mountPoint);
        shadowRoot.appendChild(rootContainer);

        const jss = create({
          ...jssPreset(),
          insertionPoint: reactRoot,
        });

        const cache = createCache({
          key: 'css',
          prepend: true,
          container: emotionRoot,
        });

        const attributes = extractAttributes(this);

        ReactDOM.render(
          <StylesProvider jss={jss}>
            <CacheProvider value={cache}>
              <ThemeProvider theme={SwTheme(rootContainer)}>
                <Provider store={store}>
                  <Router initialEntries={['/']}>
                    <EventsHandlerWrapper>
                      <SwAuth attributes={attributes} container={rootContainer} setAttrCallback={this.setAttributeChangeCallback} />
                    </EventsHandlerWrapper>
                  </Router>
                </Provider>
              </ThemeProvider>
            </CacheProvider>
          </StylesProvider>,
          mountPoint
        );
      }
    }
  );
};

setTimeout(() => {
  // for testing purposes
  const container = document.body.querySelector('.custom-auth-container');

  InitSwAuth({
    container,
  });
});
