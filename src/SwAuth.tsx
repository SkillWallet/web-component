import { withRouter, MemoryRouter as Router } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import createCache from '@emotion/cache';
import ReactDOM from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useEffect } from 'react';
import { SwTheme } from './theme';
import MainDialog from './components/MainDialog';
import { isOpen, showDialog, setPartnerKey, setCommunity } from './store/sw-auth.reducer';
import store from './store/store';
import IAttributes from './interfaces/attributes';
import { getCommunity } from './services/web3/web3Service';
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

const App = withRouter(({ attributes, container }: any) => {
  const dispatch = useDispatch();
  const open = useSelector(isOpen);

  useEffect(() => {
    const fetchData = async () => {
      const { partnerKey } = attributes;
      if (partnerKey) {
        console.log('use efecs');
        dispatch(setPartnerKey(partnerKey));
        const community = await getCommunity(partnerKey);
        dispatch(setCommunity(community));
      }
    };
    fetchData();
  }, [attributes, dispatch]);

  const handleClickOpen = () => {
    dispatch(showDialog(true));
  };

  const handleClose = () => {
    dispatch(showDialog(false));
  };

  return (
    <>
      <SwButton
        sx={{
          height: '40px',
          width: '100px',
        }}
        mode="dark"
        onClick={handleClickOpen}
      >
        Connect
      </SwButton>
      <MainDialog open={open} handleClose={handleClose} container={container} />
    </>
  );
});

export class SWAuth extends HTMLElement {
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

    const persistor = persistStore(store);

    const attributes = extractAttributes(this);

    ReactDOM.render(
      <StylesProvider jss={jss}>
        <CacheProvider value={cache}>
          <ThemeProvider theme={SwTheme(rootContainer)}>
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <Router initialEntries={['/']}>
                  <EventsHandlerWrapper>
                    <App attributes={attributes} container={rootContainer} />
                  </EventsHandlerWrapper>
                </Router>
              </PersistGate>
            </Provider>
          </ThemeProvider>
        </CacheProvider>
      </StylesProvider>,
      mountPoint
    );
  }
}

customElements.define('sw-auth', SWAuth);
