import { withRouter, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import Portal from '@mui/material/Portal';
import { CSSObject } from '@emotion/react';
import MainDialog from './components/MainDialog';
import { resetUIState } from './store/store';
import { setUseDev } from './services/web3/env';
// import { validateDomain } from './services/web3/web3Service';
import { AttributeNames, checkIfAttributeHasChanged, dispatchEvent, parseAttributeValue } from './utils/utils';
import { AutButtonProps } from './types/sw-auth-config';
import { OutputEventTypes } from './types/event-types';
import { autUiState, ResultState, setCommunityExtesnionAddress, showDialog } from './store/aut.reducer';
import { useAppDispatch } from './store/store.model';
import { RoundedWebButton } from './components/WebButton';

const AutModal = withRouter(({ container, rootContainer = null }: any) => {
  const dispatch = useAppDispatch();
  const uiState = useSelector(autUiState);

  const handleClose = (event, reason) => {
    // if (reason && reason === 'backdropClick') return;
    dispatch(showDialog(false));
  };

  useEffect(() => {
    // increase zIndex for the custom container so that the button is under modal
    if (rootContainer) {
      (rootContainer as HTMLElement).style.zIndex = uiState.showDialog ? '999999' : '0';
    }
  }, [uiState, rootContainer]);

  return (
    <>
      <MainDialog open={uiState.showDialog} handleClose={handleClose} container={container} />
    </>
  );
});

export const AutButton = ({ buttonStyles, dropdownStyles, attributes, container, setAttrCallback }: AutButtonProps<CSSObject>) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const uiState = useSelector(autUiState);
  // const currentUser = useSelector(currentUserState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonHidden, setButtonHidden] = useState(false);

  const selectEnvironment = () => {
    if (attributes.useDev) {
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

  const setAttributes = () => {
    if (attributes.communityAddress) {
      console.log(attributes.communityAddress);
      dispatch(setCommunityExtesnionAddress(attributes.communityAddress as string));
    } else {
      // Probably throw error cause we can't do anything without it
      // dispatch(showGlobalError('Community address attribute is missing.'));
    }
    selectEnvironment();
  };

  const initializeAut = async () => {
    // const sw = JSON.parse(sessionStorage.getItem('skillWallet'));
    // if (sw) {
    //   const currentTime = new Date().getTime();
    //   // 8 Hours
    //   const sessionLength = new Date(8 * 60 * 60 * 1000 + sw.timestamp).getTime();
    //   if (currentTime < sessionLength) {
    //     const isLoggedIn = true;
    //     dispatch(
    //       setUserData({
    //         username: sw.nickname,
    //         profileImageUrl: sw.imageUrl,
    //         isLoggedIn,
    //       })
    //     );
    //     dispatchSwEvent(OutputEventTypes.Login, isLoggedIn);
    //   } else {
    //     const isLoggedIn = false;
    //     window.sessionStorage.removeItem('skillWallet');
    //     dispatch(resetUIState);
    //     dispatch(setLoggedIn(isLoggedIn));
    //     dispatchSwEvent(OutputEventTypes.Login, isLoggedIn);
    //   }
    // }
  };

  const handleButtonClick = () => {
    // if (currentUser.isLoggedIn) {

    if (uiState.user) {
      // if (!attributes.useButtonOptions) {
      window.sessionStorage.removeItem('aut-data');
      dispatch(resetUIState);
      dispatchEvent(OutputEventTypes.Disconnected, false);
    } else {
      history.push('/');
      dispatch(resetUIState);
      dispatch(showDialog(true));
    }
  };

  const handleMouseEnter = (event) => {
    if (anchorEl !== event.currentTarget && attributes.useButtonOptions && false) {
      setAnchorEl(container);
    }
  };

  const handleMenuButtonClicked = () => {
    window.sessionStorage.removeItem('skillWallet');
    dispatch(resetUIState);
    // dispatchEvent(OutputEventTypes.Connected, false);
    setAnchorEl(null);
  };

  const handleHideMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAttributes();
    dispatchEvent(OutputEventTypes.Init);
    // setButtonHidden(attributes.hideButton as boolean);
    // dispatch(setDisableCreateNewUser(attributes.disableCreateNewUser as boolean));

    // setAttrCallback((name: string, prevValue: string, currVal: string) => {
    //   const notChanged = !checkIfAttributeHasChanged(prevValue, currVal);
    //   if (notChanged) {
    //     return; // do nothing if its the same
    //   }
    //   const value = parseAttributeValue(name, currVal);
    //   if (name === AttributeNames.hideButton) {
    //     setButtonHidden(value);
    //   } else if (name === AttributeNames.disableCreateNewUser) {
    //     dispatch(setDisableCreateNewUser(value));
    //   }
    // });
  }, []);

  useEffect(() => {
    initializeAut();
  }, []);

  return (
    <>
      <Portal container={container}>
        {!buttonHidden && (
          <>
            <RoundedWebButton />
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
                {false && (
                  <Avatar
                    className="swButtonAvatar"
                    src={
                      // currentUser.profileImageUrl
                      null
                    }
                  />
                )}
                <Typography className="swButtonText" variant="h2" color="#FFFFFF">
                  {/* {currentUser.isLoggedIn ? currentUser.username : 'Connect Wallet'} */}
                  {uiState.user ? 'Connected' : 'Connect with āut'}
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

export default AutModal;
