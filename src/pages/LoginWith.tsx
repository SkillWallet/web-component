import React from 'react';
import { SwButton } from 'sw-web-shared';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as PlusIcon } from '../assets/create-unsel.svg';
import { ReactComponent as SwIcon } from '../assets/sw-logo-icon.svg';
import { swData } from '../store/sw-auth.reducer';

const LoginWith: React.FunctionComponent = (props) => {
  const swState = useSelector(swData);
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
        <Box sx={{ width: '60px', height: '53px' }} component="img" src="https://dito-assets.s3.eu-west-1.amazonaws.com/wallet-white.svg" />
        <Typography variant="h1" sx={{ textDecorationLine: 'underline', my: 'auto', fontWeight: '400' }}>
          Login With
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
          startIcon={<SwIcon />}
          mode="dark"
          component={Link}
          disabled={swState.partnerMode}
          to="/skillwallet"
          label={swState.partnerMode ? 'Existing Partner' : 'SkillWallet'}
        />
        <SwButton
          sx={{
            borderColor: 'primary.main',
          }}
          btnType="large"
          startIcon={<PlusIcon />}
          mode="dark"
          disabled={swState.disableCreateNewUser}
          component={Link}
          to="/newuser"
          label={swState.isPartner ? 'New Partner' : 'New User'}
        />
      </Box>
    </Box>
  );
};

export default LoginWith;
