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
  setTokenId,
} from '../store/sw-auth.reducer';
import { checkForInactiveSkillWallet, fetchSkillWallet } from '../services/web3/web3Service';
import { ReactComponent as MetaMaskIcon } from '../assets/metamask.svg';
import { ReactComponent as PortisIcon } from '../assets/portis_icon.svg';

import ErrorBox from '../components/ErrorBox';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  const handleError = () => {
    dispatch(resetState());
    history.push('/');
  };

  const handleMetamaskClick = async () => {
    dispatch(setLoading(true));

    const { ethereum } = window;
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (ethereum.selectedAddress) {
        const res = await checkForInactiveSkillWallet(ethereum.selectedAddress);
        if (res && res.inactiveSkillWalletExists) {
          dispatch(setTokenId(res.tokenId.toString()));
          history.push('/qr');
        } else {
          await fetchSkillWallet(ethereum.selectedAddress)
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
              setErrorData({ message: 'Failed to retrieve SkillWallet' });
            })
            .finally(() => {
              dispatch(setLoading(false));
            });
        }
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      setErrorData({ message: 'Failed to retrieve SkillWallet' });
      // this.onSkillwalletError.emit();
      // this.isLoadingEvent.emit(false);
      // alert(error);
    }
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
        <ErrorBox errorMessage={errorData.message} action={handleError} />
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
