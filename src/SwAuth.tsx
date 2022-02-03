/* eslint-disable class-methods-use-this */
import { withRouter, MemoryRouter as Router, useHistory } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import createCache from '@emotion/cache';
import ReactDOM from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Box } from '@mui/material';
import dotenv from 'dotenv';
import { SwTheme } from './theme';
import MainDialog from './components/MainDialog';
import {
  isOpen,
  showDialog,
  setPartnerKey,
  setCommunity,
  currentSkillWallet,
  profileImageUrl,
  currentUsername,
  currentlyLoggedIn,
  resetState,
  setLoggedIn,
} from './store/sw-auth.reducer';
import store from './store/store';
import IAttributes from './interfaces/attributes';
import { changeNetwork, getCommunity } from './services/web3/web3Service';
import { EventsHandlerWrapper } from './components/EventsHandlerWrapper';

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

const App = withRouter(({ attributes, container, setAttrCallback }: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const open = useSelector(isOpen);
  const username = useSelector(currentUsername);
  const image = useSelector(profileImageUrl);
  const loggedIn = useSelector(currentlyLoggedIn);
  const [hideButton, setHideButton] = useState(false);

  useEffect(() => {
    // Remember they are strings
    // Set attribute change callback
    setAttrCallback((name, oldVal, newVal) => {
      if (name === 'hide-button') {
        setHideButton(newVal === 'true');
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { partnerKey } = attributes;
      if (partnerKey) {
        console.log('PK', partnerKey);
        dispatch(setPartnerKey(partnerKey));

        const event = new CustomEvent('initSkillwalletAuth', {
          composed: true,
          cancelable: true,
          bubbles: true,
        });
        console.log('dispatchin init event');
        window.dispatchEvent(event);
        // await changeNetwork();
        // console.log('getting community');
        // const community = await getCommunity(partnerKey);
        // console.log(community);
        // dispatch(setCommunity(community));
      }
    };
    fetchData();
  }, []);

  const handleButtonClick = () => {
    if (loggedIn) {
      dispatch(resetState());
      dispatch(setLoggedIn(false));
      const event = new CustomEvent('onSkillwalletLogin', {
        composed: true,
        cancelable: true,
        bubbles: true,
        detail: false,
      });
      window.dispatchEvent(event);
    } else {
      dispatch(showDialog(true));
    }
  };

  const handleClose = () => {
    dispatch(showDialog(false));
    dispatch(resetState());
    history.push('/');
  };

  return (
    <>
      {!hideButton && (
        <SwButton
          sx={{
            height: '57px',
            width: '180px',
          }}
          mode="dark"
          btnType="medium"
          onClick={handleButtonClick}
          label={loggedIn ? username : 'Connect Wallet'}
          startIcon={loggedIn ? <Avatar sx={{ width: '36px', height: '36px' }} src={image} /> : undefined}
        />
      )}

      <MainDialog open={open} handleClose={handleClose} container={container} />
    </>
  );
});

export class SWAuth extends HTMLElement {
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
    const rootContainer = document.createElement('div');
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
                  <App attributes={attributes} container={rootContainer} setAttrCallback={this.setAttributeChangeCallback} />
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

customElements.define('sw-auth', SWAuth);
