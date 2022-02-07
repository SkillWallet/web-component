/* eslint-disable class-methods-use-this */
import { withRouter, useHistory } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import MainDialog from './components/MainDialog';
import {
  isOpen,
  showDialog,
  setPartnerKey,
  profileImageUrl,
  currentUsername,
  currentlyLoggedIn,
  resetState,
  setLoggedIn,
} from './store/sw-auth.reducer';
import { setUseDev } from './services/web3/env';

const SwAuth = withRouter(({ attributes, container, setAttrCallback }: any) => {
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
    const { partnerKey, useDev } = attributes;
    if (useDev) {
      setUseDev(useDev === 'true');
    }
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
    }
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

export default SwAuth;
