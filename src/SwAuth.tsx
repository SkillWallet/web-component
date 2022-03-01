/* eslint-disable class-methods-use-this */
import { withRouter, useHistory } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import Portal from '@mui/material/Portal';
import MainDialog from './components/MainDialog';
import { isOpen, showDialog, setPartnerKey, resetState, setLoading } from './store/sw-auth.reducer';
import { setLoggedIn, setUserData, currentUserState } from './store/sw-user-data.reducer';
import { setUseDev } from './services/web3/env';
// import { setUserName, setUserProfilePicture } from './store/sw-user-data.reducer';

let modalRenders = 1;

const SwAuthModal = withRouter(({ container, rootContainer = null }: any) => {
  const dispatch = useDispatch();
  const open = useSelector(isOpen);

  console.log(modalRenders);
  // eslint-disable-next-line no-plusplus
  modalRenders++;

  const handleClose = () => {
    dispatch(showDialog(false));
    dispatch(resetState());
    console.log('pushing');
  };

  useEffect(() => {
    // increase zIndex for the custom container so that the button is under modal
    if (rootContainer) {
      (rootContainer as HTMLElement).style.zIndex = open ? '999999' : '0';
    }
  }, [rootContainer]);

  return (
    <>
      {console.log('IS OPEN RERENDER ', open)}
      <MainDialog open={open} handleClose={handleClose} container={container} />
    </>
  );
});

export const SwAuthButton = ({ attributes, container, setAttrCallback }: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserState);
  console.log(currentUser);

  const [buttonHidden, setButtonHidden] = useState(false);

  useEffect(() => {
    // Remember they are strings
    // Set attribute change callback
    setAttrCallback((name, oldVal, newVal) => {
      if (name === 'hide-button') {
        setButtonHidden(newVal === 'true');
      }
    });
  }, []);

  useEffect(() => {
    const { partnerKey, useDev, hideButton } = attributes;
    if (hideButton) {
      setButtonHidden(hideButton === 'true');
    }
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
    const sw = JSON.parse(sessionStorage.getItem('skillWallet'));
    if (sw) {
      const currentTime = new Date().getTime();
      // 8 Hours
      const sessionLength = new Date(8 * 60 * 60 * 1000 + sw.timestamp).getTime();
      if (currentTime < sessionLength) {
        dispatch(
          setUserData({
            username: sw.nickname,
            profileImageUrl: sw.imageUrl,
            isLoggedIn: true,
          })
        );
        // dispatch(setUserName(sw.nickname));
        // dispatch(setUserProfilePicture(sw.imageUrl));
        // dispatch(setLoggedIn(true));
        const event = new CustomEvent('onSkillwalletLogin', {
          composed: true,
          cancelable: true,
          bubbles: true,
          detail: true,
        });
        window.dispatchEvent(event);
      } else {
        window.sessionStorage.removeItem('skillWallet');
        dispatch(resetState());
        dispatch(setLoggedIn(false));
        const event = new CustomEvent('onSkillwalletLogin', {
          composed: true,
          cancelable: true,
          bubbles: true,
          detail: false,
        });
        window.dispatchEvent(event);
      }
    }
  }, []);

  const handleButtonClick = () => {
    if (currentUser.isLoggedIn) {
      window.sessionStorage.removeItem('skillWallet');
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
      history.push('/');
      dispatch(setLoading(false));
      dispatch(showDialog(true));
    }
  };

  return (
    <>
      {console.log('ROOT RENDER BUTTON')}
      <Portal container={container}>
        {!buttonHidden && (
          <SwButton
            sx={{
              height: '57px',
              width: '180px',
            }}
            mode="dark"
            btnType="medium"
            onClick={handleButtonClick}
            label={currentUser.isLoggedIn ? currentUser.username : 'Connect Wallet'}
            startIcon={
              currentUser.isLoggedIn ? <Avatar sx={{ width: '36px', height: '36px' }} src={currentUser.profileImageUrl} /> : undefined
            }
          />
        )}
      </Portal>
    </>
  );
};

export default SwAuthModal;
