import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';

const LoginWith: React.FunctionComponent = (props) => {
  const history = useHistory();

  const handleAutIdClicked = () => {
    history.push('autid');
  };

  const handleNewUserClicked = () => {
    history.push('newuser');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mt: '76px' }}>
        <AutLogo />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        LOGIN OR SIGN-UP
      </Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AutButton sx={{ mt: '48px' }} onClick={handleAutIdClicked}>
          Connect with āut
        </AutButton>
        <AutButton sx={{ mt: '30px' }} onClick={handleNewUserClicked}>
          New User
        </AutButton>
      </Box>
    </Box>
  );
};

export default LoginWith;
