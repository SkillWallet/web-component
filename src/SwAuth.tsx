import { withRouter, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import Portal from '@mui/material/Portal';
import { CSSObject } from '@emotion/react';
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
// import { validateDomain } from './services/web3/web3Service';
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

export const SwAuthButton = ({ buttonStyles, dropdownStyles, attributes, container, setAttrCallback }: SwAuthButtonProps<CSSObject>) => {
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
      // dispatch(startValidatingDomain());
      // try {
      //   const isValid = await validateDomain(attributes.partnerKey);
      //   if (!isValid) {
      //     dispatch(showGlobalError('Invalid domain. Please add the URL throught the dashboard.'));
      //   }
      // } catch (e) {
      //   dispatch(showGlobalError('Failed to validate domain.'));
      // } finally {
      //   dispatch(finishValidatingDomain());
      // }
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
            <Button
              sx={{
                cursor: 'pointer',
                background: '#000000',
                '& .MuiTypography-root': {
                  textTransform: 'none',
                  fontSize: '14px',
                  lineHeight: '25px',
                  fontWeight: '500',
                },
                '& .swButtonAvatar': { width: '36px', height: '36px' },
                boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
                '&:hover': {
                  background: '#FFFFFF',
                  borderColor: '#000000',
                  '& .swButtonText': {
                    color: '#000000',
                    mt: '4px',
                  },
                },
                height: '47px',
                width: '180px',
                ...buttonStyles,
              }}
              onClick={handleButtonClick}
              onMouseEnter={handleMouseEnter}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '100%' }}>
                {currentUser.isLoggedIn && <Avatar className="swButtonAvatar" src={currentUser.profileImageUrl} />}
                <Typography className="swButtonText" variant="h2" color="#FFFFFF">
                  {currentUser.isLoggedIn ? currentUser.username : 'Connect Wallet'}
                </Typography>
              </Box>
            </Button>
            <Menu
              sx={{
                '& .MuiMenu-list': {
                  padding: '0px',
                },
                '& .swButtonOption': {
                  cursor: 'pointer',
                  background: '#000000',
                  '& .swButtonOptionText': {
                    textTransform: 'none',
                    fontSize: '14px',
                    lineHeight: '25px',
                    fontWeight: '500',
                  },
                  '&:hover': {
                    background: '#FFFFFF',
                    borderColor: '#000000',
                    '& .swButtonOptionText': {
                      color: '#000000',
                      mt: '4px',
                    },
                  },

                  height: '40px',
                  width: '180px',
                  border: '0px',
                },
                boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
                ...dropdownStyles,
              }}
              container={container}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleHideMenu}
              MenuListProps={{ onMouseLeave: handleHideMenu }}
            >
              <MenuItem sx={{ p: '0px' }}>
                <Button className="swButtonOption" onClick={handleMenuButtonClicked}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Typography className="swButtonOptionText" variant="h2" color="#FFFFFF">
                      Logout
                    </Typography>
                  </Box>
                </Button>
              </MenuItem>
            </Menu>
          </>
        )}
      </Portal>
    </>
  );
};

export default SwAuthModal;
