import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { resetUIState } from '../store/store';
import { showDialog, setLoading, loadingFinished } from '../store/sw-ui-reducer';
import { setUserData } from '../store/sw-user-data.reducer';
import { fetchSkillWallet } from '../services/web3/web3Service';
import { ReactComponent as MetaMaskIcon } from '../assets/metamask.svg';
import { ReactComponent as PortisIcon } from '../assets/portis_icon.svg';

import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';
import BackButton from '../components/BackButton';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  const performMetamaskLogin = async () => {
    dispatch(setLoading(true));
    await fetchSkillWallet(dispatch)
      .then((result) => {
        dispatch(showDialog(false));
        dispatch(
          setUserData({
            username: result.nickname,
            profileImageUrl: result.imageUrl,
            isLoggedIn: true,
          })
        );
        window.sessionStorage.setItem('skillWallet', JSON.stringify(result));
        console.log(result);
        const event = new CustomEvent('onSkillwalletLogin', {
          composed: true,
          cancelable: true,
          bubbles: true,
          detail: true,
        });
        window.dispatchEvent(event);

        dispatch(loadingFinished());
      })
      .catch((e) => {
        if (e.message === ErrorTypes.SkillWalletExistsButInactive) {
          dispatch(loadingFinished());
          history.push('/qr');
        } else if (e.message === ErrorTypes.SkillWalletNotFound) {
          setErrorData({
            errorMessage: 'SkillWallet not found.',
            actionLabel: 'Go Back',
            action: () => {
              dispatch(resetUIState);
              history.push('/');
            },
          });
          dispatch(loadingFinished());
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
          dispatch(loadingFinished());
        }
      });
  };

  const handleMetamaskClick = async () => {
    performMetamaskLogin();
  };

  const handleBackClick = async () => {
    history.goBack();
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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <BackButton
              sx={{
                background: '#FFFFFF',
              }}
              handleClick={handleBackClick}
            />
            <Box
              sx={{
                flexGrow: 1,
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
                width: '45px',
                height: '45px',
              }}
            />
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
