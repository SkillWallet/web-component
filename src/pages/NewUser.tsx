import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import BackButton from '../components/BackButton';
import AutLogo from '../components/AutLogo';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { useAppDispatch } from '../store/store.model';
import { injectMetamask } from '../services/web3/api';
import { EnableAndChangeNetwork } from '../services/ProviderFactory/web3.network';

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const [metamaskSelected, setMetamaskSelected] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // const fetchData = async () => {};
    // fetchData();
  }, []);

  const handleInjectFromMetamaskClick = async () => {
    try {
      await EnableAndChangeNetwork();
      history.push('userdetails');
    } catch (e) {
      console.log('cancel inject metamask');
    }
  };

  const handleNextClick = () => {
    history.push('userdetails');
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
      <Box sx={{ mt: '76px' }}>
        <AutLogo />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        WELCOME
      </Typography>
      <Typography sx={{ mt: '25px' }} variant="h4">
        First, import your wallet
      </Typography>
      <Typography variant="h4">Or create a brand new account</Typography>
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
          onClick={handleInjectFromMetamaskClick}
        >
          Inject from Metamask
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
          Create Social Account
        </AutButton>
      </Box>
    </Box>
  );
};

export default NewUser;
