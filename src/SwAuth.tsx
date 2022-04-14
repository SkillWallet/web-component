import { withRouter, useHistory } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Menu, MenuItem } from '@mui/material';
import Portal from '@mui/material/Portal';
import MainDialog from './components/MainDialog';
import { setPartnerKey, swData } from './store/sw-auth.reducer';
import { resetUIState } from './store/store';
import {
  isOpen,
  showDialog,
  setDisableCreateNewUser,
  showGlobalError,
  startValidatingDomain,
  finishValidatingDomain,
} from './store/sw-ui-reducer';
import { setLoggedIn, setUserData, currentUserState } from './store/sw-user-data.reducer';
import { setUseDev } from './services/web3/env';
import { validateDomain } from './services/web3/web3Service';
import { AttributeNames, checkIfAttributeHasChanged, dispatchSwEvent, parseAttributeValue } from './utils/utils';
import { SwAuthButtonProps } from './types/sw-auth-config';
import { OutputEventTypes } from './types/event-types';

const SwAuthModal = withRouter(({ container, rootContainer = null }: any) => {
  const dispatch = useDispatch();
  const swState = useSelector(swData);
  const open = useSelector(isOpen);

  const handleClose = (event, reason) => {
    if (swState.partnerMode && reason && reason === 'backdropClick') return;
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

export const SwAuthButton = ({ attributes, container, setAttrCallback }: SwAuthButtonProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonHidden, setButtonHidden] = useState(false);

  const onSetParnersKey = (partnerKey: string) => {
    if (partnerKey) {
      console.log('PK', attributes.partnerKey);
      dispatch(setPartnerKey(attributes.partnerKey as string));
      dispatchSwEvent(OutputEventTypes.Init);
    } else {
      dispatch(showGlobalError('Partner key attribute is missing.'));
    }
  };

  const onUseEnv = async (useDev: boolean) => {
    if (useDev) {
      setUseDev(attributes.useDev);
    } else {
      dispatch(startValidatingDomain());
      try {
        const isValid = await validateDomain(attributes.partnerKey);
        if (!isValid) {
          dispatch(showGlobalError('Invalid domain. Please add the URL throught the dashboard.'));
        }
      } catch (e) {
        dispatch(showGlobalError('Failed to validate domain.'));
      } finally {
        dispatch(finishValidatingDomain());
      }
    }
  };

  const initializeSW = async () => {
    const sw = JSON.parse(sessionStorage.getItem('skillWallet'));
    if (sw) {
      const currentTime = new Date().getTime();
      // 8 Hours
      const sessionLength = new Date(8 * 60 * 60 * 1000 + sw.timestamp).getTime();
      if (currentTime < sessionLength) {
        const isLoggedIn = true;
        dispatch(
          setUserData({
            username: sw.nickname,
            profileImageUrl: sw.imageUrl,
            isLoggedIn,
          })
        );
        dispatchSwEvent(OutputEventTypes.Login, isLoggedIn);
      } else {
        const isLoggedIn = false;
        window.sessionStorage.removeItem('skillWallet');
        dispatch(resetUIState);
        dispatch(setLoggedIn(isLoggedIn));
        dispatchSwEvent(OutputEventTypes.Login, isLoggedIn);
      }
    }
  };

  const handleButtonClick = () => {
    if (currentUser.isLoggedIn) {
      if (!attributes.useButtonOptions) {
        window.sessionStorage.removeItem('skillWallet');
        dispatch(resetUIState);
        dispatchSwEvent(OutputEventTypes.Login, false);
      }
    } else {
      history.push('/');
      dispatch(resetUIState);
      dispatch(showDialog(true));
    }
  };

  const handleMouseEnter = (event) => {
    if (anchorEl !== event.currentTarget && attributes.useButtonOptions && currentUser.isLoggedIn) {
      setAnchorEl(container);
    }
  };

  const handleMenuButtonClicked = () => {
    window.sessionStorage.removeItem('skillWallet');
    dispatch(resetUIState);
    dispatchSwEvent(OutputEventTypes.Login, false);
    setAnchorEl(null);
  };

  const handleHideMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setButtonHidden(attributes.hideButton as boolean);
    onSetParnersKey(attributes.partnerKey as string);
    onUseEnv(attributes.useDev as boolean);
    dispatch(setDisableCreateNewUser(attributes.disableCreateNewUser as boolean));

    setAttrCallback((name: string, prevValue: string, currVal: string) => {
      const notChanged = !checkIfAttributeHasChanged(prevValue, currVal);
      if (notChanged) {
        return; // do nothing if its the same
      }
      const value = parseAttributeValue(name, currVal);
      if (name === AttributeNames.hideButton) {
        setButtonHidden(value);
      } else if (name === AttributeNames.disableCreateNewUser) {
        dispatch(setDisableCreateNewUser(value));
      }
    });
  }, []);

  useEffect(() => {
    initializeSW();
  }, []);

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
