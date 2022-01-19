import React from 'react';
import { SwButton } from 'sw-web-shared';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ReactComponent as PlusIcon } from '../assets/create-unsel.svg';
import { ReactComponent as SwIcon } from '../assets/sw-logo-icon.svg';

const LoginWith: React.FunctionComponent = (props) => {
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
            whiteSpace: 'nowrap',
            borderColor: 'primary.main',
            height: '75px',
            maxWidth: '320px',
          }}
          startIcon={<SwIcon />}
          mode="dark"
          component={Link}
          to="/skillwallet"
          label="Skill Wallet"
        />
        <SwButton
          sx={{
            whiteSpace: 'nowrap',
            borderColor: 'primary.main',
            height: '75px',
            maxWidth: '320px',
          }}
          startIcon={<PlusIcon />}
          mode="dark"
          component={Link}
          to="/newuser"
          label="New User"
        />
      </Box>
    </Box>
  );
};

export default LoginWith;
