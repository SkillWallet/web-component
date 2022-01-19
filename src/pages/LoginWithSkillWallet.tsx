import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { setLoading, setSkillWallet } from '../store/sw-auth.reducer';
import { changeNetwork, fetchSkillWallet } from '../services/web3/web3Service';
import { ReactComponent as MetaMaskIcon } from '../assets/metamask.svg';
import { ReactComponent as PortisIcon } from '../assets/portis_icon.svg';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();

  const handleMetamaskClick = async () => {
    dispatch(setLoading(true));
    const { ethereum } = window;
    try {
      if (ethereum.request) {
        await changeNetwork();
        await ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.providers.Web3Provider(ethereum);
        if (ethereum.selectedAddress) {
          const community = await fetchSkillWallet(web3Provider, ethereum.selectedAddress);
          dispatch(setSkillWallet(window.sessionStorage.getItem('skillWallet')));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        // Onboarding?
      }
    } catch (error) {
      dispatch(setLoading(false));
      // this.onSkillwalletError.emit();
      // this.isLoadingEvent.emit(false);
      // alert(error);
    }
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 4000);
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
            whiteSpace: 'nowrap',
            borderColor: 'primary.main',
            height: '75px',
            maxWidth: '320px',
          }}
          startIcon={
            <Box sx={{ width: '36px', height: '36px' }} component="img" src="https://dito-assets.s3.eu-west-1.amazonaws.com/metamask.svg" />
          }
          mode="dark"
          onClick={handleMetamaskClick}
          label="Login with Metamask"
        />
        <SwButton
          sx={{
            whiteSpace: 'nowrap',
            borderColor: 'primary.main',
            height: '75px',
            maxWidth: '320px',
          }}
          disabled
          startIcon={
            <Box
              sx={{ width: '36px', height: '36px' }}
              component="img"
              src="https://dito-assets.s3.eu-west-1.amazonaws.com/portis_icon.svg"
            />
          }
          mode="dark"
          component={Link}
          to="/"
          label="User your Password"
        />
        <SwButton
          sx={{
            whiteSpace: 'nowrap',
            borderColor: 'primary.main',
            height: '75px',
            maxWidth: '320px',
          }}
          disabled
          mode="dark"
          component={Link}
          to="/qr"
          label="Scan QR Code"
        />
      </Box>
    </Box>
  );
};

export default LoginWithSkillWallet;
