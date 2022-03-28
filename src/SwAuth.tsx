/* eslint-disable class-methods-use-this */
import { withRouter, useHistory } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Menu, MenuItem } from '@mui/material';
import Portal from '@mui/material/Portal';
import MainDialog from './components/MainDialog';
import { setPartnerKey, swData } from './store/sw-auth.reducer';
import { resetUIState } from './store/store';
import { isOpen, showDialog, setLoading, setDisableCreateNewUser, showGlobalError, startLoading } from './store/sw-ui-reducer';
import { setLoggedIn, setUserData, currentUserState } from './store/sw-user-data.reducer';
import { setUseDev } from './services/web3/env';
import { validateDomain } from './services/web3/web3Service';

const SwAuthModal = withRouter(({ container, rootContainer = null }: any) => {
  const dispatch = useDispatch();
  const open = useSelector(isOpen);

  const handleClose = () => {
    dispatch(showDialog(false));
  };

  useEffect(() => {
    // increase zIndex for the custom container so that the button is under modal
    if (rootContainer) {
      (rootContainer as HTMLElement).style.zIndex = open ? '999999' : '0';
    }
  }, [open, rootContainer]);

  return (
    <>
      <MainDialog open={open} handleClose={handleClose} container={container} />
    </>
  );
});

export const SwAuthButton = ({ attributes, container, setAttrCallback }: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserState);

  const [buttonHidden, setButtonHidden] = useState(false);
  const [showButtonDropDown, setShowButtonDropDown] = useState(false);

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
    const initialize = async () => {
      const { useButtonOptions, disableCreateNewUser, partnerKey, useDev, hideButton } = attributes;
      if (useButtonOptions) {
        console.log(useButtonOptions);
        setShowButtonDropDown(useButtonOptions === 'true');
      }
      if (hideButton) {
        setButtonHidden(hideButton === 'true');
      }
      if (partnerKey) {
        console.log('PK', partnerKey);
        dispatch(setPartnerKey(partnerKey));

        const event = new CustomEvent('initSkillwalletAuth', {
          composed: true,
          cancelable: true,
          bubbles: true,
        });
        window.dispatchEvent(event);
      } else {
        dispatch(showGlobalError('Partner key attribute is missing.'));
      }
      if (useDev) {
        dispatch(startLoading('Validating domain name.'));
        setUseDev(useDev === 'true');
        const isValid = await validateDomain(partnerKey);
        if (!isValid) {
          dispatch(showGlobalError('Invalid domain. Please add the URL throught the dashboard.'));
        }
      } else {
        const isValid = await validateDomain(partnerKey);
        if (!isValid) {
          dispatch(showGlobalError('Invalid domain. Please add the URL throught the dashboard.'));
        }
      }

      if (disableCreateNewUser) {
        dispatch(setDisableCreateNewUser(disableCreateNewUser === 'true'));
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
          const event = new CustomEvent('onSkillwalletLogin', {
            composed: true,
            cancelable: true,
            bubbles: true,
            detail: true,
          });
          window.dispatchEvent(event);
        } else {
          window.sessionStorage.removeItem('skillWallet');
          dispatch(resetUIState);
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
    };
    initialize();
  }, []);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleButtonClick = () => {
    if (currentUser.isLoggedIn) {
      if (!showButtonDropDown) {
        window.sessionStorage.removeItem('skillWallet');
        dispatch(resetUIState);
        const event = new CustomEvent('onSkillwalletLogin', {
          composed: true,
          cancelable: true,
          bubbles: true,
          detail: false,
        });
        window.dispatchEvent(event);
      }
    } else {
      history.push('/');
      dispatch(resetUIState);
      dispatch(showDialog(true));
    }
  };

  const handleMouseEnter = (event) => {
    if (anchorEl !== event.currentTarget && showButtonDropDown && currentUser.isLoggedIn) {
      setAnchorEl(container);
    }
  };

  const handleMenuButtonClicked = () => {
    window.sessionStorage.removeItem('skillWallet');
    dispatch(resetUIState);
    const event = new CustomEvent('onSkillwalletLogin', {
      composed: true,
      cancelable: true,
      bubbles: true,
      detail: false,
    });
    window.dispatchEvent(event);
    setAnchorEl(null);
  };

  const handleHideMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Portal container={container}>
        {!buttonHidden && (
          <>
            <SwButton
              sx={{
                height: '57px',
                width: '180px',
              }}
              mode="dark"
              btnType="medium"
              onClick={handleButtonClick}
              onMouseEnter={handleMouseEnter}
              label={currentUser.isLoggedIn ? currentUser.username : 'Connect Wallet'}
              startIcon={
                currentUser.isLoggedIn ? <Avatar sx={{ width: '36px', height: '36px' }} src={currentUser.profileImageUrl} /> : undefined
              }
            />
            <Menu
              sx={{
                '& .MuiMenu-list': {
                  padding: '0px',
                },
                '& .MuiPaper-root': {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}
              container={container}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleHideMenu}
              MenuListProps={{ onMouseLeave: handleHideMenu }}
            >
              <MenuItem sx={{ p: '0px' }}>
                <SwButton
                  sx={{
                    height: '40px',
                    width: '180px',
                  }}
                  mode="dark"
                  btnType="small"
                  onClick={handleMenuButtonClicked}
                  label="Logout"
                />
              </MenuItem>
            </Menu>
          </>
        )}
      </Portal>
    </>
  );
};

export default SwAuthModal;
