import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  setLoading,
  setSkillWallet,
  resetState,
  setLoggedIn,
  setUserName,
  setUserProfilePicture,
  showDialog,
} from '../store/sw-auth.reducer';
import { fetchSkillWallet } from '../services/web3/web3Service';
import { ReactComponent as MetaMaskIcon } from '../assets/metamask.svg';
import { ReactComponent as PortisIcon } from '../assets/portis_icon.svg';

import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  const performMetamaskLogin = async () => {
    dispatch(setLoading(true));
    await fetchSkillWallet()
      .then((result) => {
        dispatch(setSkillWallet(result));
        dispatch(setUserName(result.nickname));
        dispatch(setUserProfilePicture(result.imageUrl));
        dispatch(setLoggedIn(true));
        dispatch(showDialog(false));
        window.sessionStorage.setItem('skillWallet', JSON.stringify(result));
        console.log(result);
        history.push('/');
        const event = new CustomEvent('onSkillwalletLogin', {
          composed: true,
          cancelable: true,
          bubbles: true,
          detail: true,
        });
        console.log('sending login event');
        window.dispatchEvent(event);
        dispatch(setLoading(false));
      })
      .catch((e) => {
        if (e.message === ErrorTypes.SkillWalletExistsButInactive) {
          dispatch(setLoading(false));
          history.push('/qr');
        } else if (e.message === ErrorTypes.SkillWalletNotFound) {
          setErrorData({
            errorMessage: 'SkillWallet not found.',
            actionLabel: 'Go Back',
            action: () => {
              dispatch(resetState());
              history.push('/');
            },
          });
          dispatch(setLoading(false));
        } else {
          console.log(e);
          setErrorData({
            errorMessage: e.message,
            actionLabel: 'Retry',
            action: () => {
              setErrorData(undefined);
              performMetamaskLogin();
            },
          });
          dispatch(setLoading(false));
        }
      });
  };

  const handleMetamaskClick = async () => {
    performMetamaskLogin();
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '460px',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {errorData ? (
        <ErrorBox errorData={errorData} />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
            }}
          >
            <Typography variant="h1" sx={{ my: 'auto', fontWeight: '400' }}>
              Welcome back! 🙌
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '30px',
            }}
          >
            <SwButton
              sx={{
                borderColor: 'primary.main',
              }}
              btnType="large"
              startIcon={<MetaMaskIcon />}
              mode="dark"
              onClick={handleMetamaskClick}
              label="Login with Metamask"
            />
            <SwButton
              sx={{
                borderColor: 'primary.main',
              }}
              disabled
              btnType="large"
              startIcon={<PortisIcon />}
              mode="dark"
              component={Link}
              to="/"
              label="User your Password"
            />
            <SwButton
              sx={{
                borderColor: 'primary.main',
              }}
              btnType="large"
              disabled
              mode="dark"
              component={Link}
              to="/qr"
              label="Scan QR Code"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default LoginWithSkillWallet;
