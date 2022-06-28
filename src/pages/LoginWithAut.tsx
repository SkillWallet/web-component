import React, { useState } from 'react';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { AutBackButton } from '../components/AutBackButton';
import { useAppDispatch } from '../store/store.model';
import AutLogo from '../components/AutLogo';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { getAutId } from '../services/web3/api';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  // const performMetamaskLogin = async () => {};

  const handleMetamaskClick = async () => {
    // performMetamaskLogin();
    dispatch(getAutId(null));
  };

  const handleBackClick = async () => {
    history.goBack();
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
      <AutBackButton />
      <Box sx={{ mt: '16px' }}>
        <AutLogo />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        WELCOME BACK
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
        <AutButton
          startIcon={
            <ButtonIcon>
              <Metamask />
            </ButtonIcon>
          }
          sx={{ mt: '29px' }}
          onClick={handleMetamaskClick}
        >
          Login with MetaMaskg
        </AutButton>
        <AutButton
          startIcon={
            <ButtonIcon>
              <WalletConnect />
            </ButtonIcon>
          }
          disabled
          sx={{ mt: '30px' }}
        >
          Use your password
        </AutButton>
      </Box>
    </Box>
  );
};

export default LoginWithSkillWallet;
