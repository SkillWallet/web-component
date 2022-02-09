import { MemoryRouter as Router } from 'react-router-dom';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SwTheme } from './theme';
import store from './store/store';
import { EventsHandlerWrapper } from './components/EventsHandlerWrapper';
import SwAuthModal, { SwAuthButton } from './SwAuth';
import { SwAuthConfig } from './types/sw-auth-config';
import { createShadowElement, extractAttributes, isElement } from './utils/utils';

function InitSwAuth(authConfig: SwAuthConfig = null) {
  const TAG_NAME = 'sw-auth';
  if (customElements.get(TAG_NAME)) {
    return;
  }
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
        const jss = create(jssPreset());
        const attributes = extractAttributes(this);

        let content: JSX.Element = null;
        let mountPoint: HTMLElement = null;

        if (authConfig?.container) {
          if (!isElement(authConfig.container)) {
            throw new Error('Container is not of type HTMLElement');
          }
          Object.assign(authConfig.container.style, {
            position: 'absolute',
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            overflow: 'hidden',
            ...(authConfig.containerStyles || {}),
          });
          const mConfig = createShadowElement({ container: authConfig.container, className: 'sw-auth-modal' });
          const bConfig = createShadowElement({ container: this, className: 'sw-auth-button' });
          mountPoint = mConfig.mountPoint;
          content = (
            <>
              <CacheProvider value={bConfig.cache}>
                <SwAuthButton container={bConfig.root} attributes={attributes} setAttrCallback={this.setAttributeChangeCallback} />
              </CacheProvider>
              <CacheProvider value={mConfig.cache}>
                <SwAuthModal rootContainer={authConfig.container} container={mConfig.root} />
              </CacheProvider>
            </>
          );
        } else {
          const config = createShadowElement({ container: this, className: 'sw-auth' });
          mountPoint = config.mountPoint;
          content = (
            <>
              <CacheProvider value={config.cache}>
                <SwAuthButton container={config.root} attributes={attributes} setAttrCallback={this.setAttributeChangeCallback} />
                <SwAuthModal container={config.root} />
              </CacheProvider>
            </>
          );
        }

        ReactDOM.render(
          <ThemeProvider theme={SwTheme()}>
            <Provider store={store}>
              <Router initialEntries={['/']}>
                <EventsHandlerWrapper>
                  <StylesProvider jss={jss}>{content}</StylesProvider>
                </EventsHandlerWrapper>
              </Router>
            </Provider>
          </ThemeProvider>,
          mountPoint
        );
      }
    }
  );
}

export default InitSwAuth;

// setTimeout(() => {
//   InitSwAuth();
// }, 100);
