import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ethers } from 'ethers';
import IPage from '../interfaces/page';
import { currentCommunity, setLoading, partnerMode } from '../store/sw-auth.reducer';
import { changeNetwork, fetchSkillWallet } from '../services/web3/web3Service';

const NewUser: React.FunctionComponent<IPage> = (props) => {
  const [metamaskSelected, setMetamaskSelected] = useState(false);
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);
  const isPartner = useSelector(partnerMode);

  const handleInjectFromMetamaskClick = async () => {
    console.log('click');
    // do this in the service
    await changeNetwork();
    console.log('changed network');
    const { ethereum } = window;
    try {
      if (ethereum.request) {
        const result = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log(result);
        // figure out where to store this
        setMetamaskSelected(true);
      }
    } catch (error) {
      //   this.onSkillwalletError.emit();
      //   alert(error);
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        {isPartner ? (
          <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
            Hello, Partner!
          </Typography>
        ) : (
          <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
            Welcome to{' '}
            <Typography variant="h2" component="span" sx={{ fontWeight: '400', textDecorationLine: 'underline' }}>
              {community.name}
            </Typography>
            !
          </Typography>
        )}
        <Typography align="center" variant="h3" sx={{ fontWeight: '400', maxWidth: '320px' }}>
          First, Import your Wallet, or create a brand new account.
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
          className={metamaskSelected ? 'active-link' : ''}
          startIcon={
            <Box sx={{ width: '36px', height: '36px' }} component="img" src="https://dito-assets.s3.eu-west-1.amazonaws.com/metamask.svg" />
          }
          mode="dark"
          onClick={handleInjectFromMetamaskClick}
          label="Inject from Metamask"
        />
        <SwButton
          sx={{
            whiteSpace: 'nowrap',
            borderColor: 'primary.main',
            height: '75px',
            maxWidth: '320px',
          }}
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
          label="Import Social Account"
          disabled
        />
        <SwButton
          sx={{
            whiteSpace: 'nowrap',
            borderColor: 'primary.main',
            height: '75px',
            maxWidth: '320px',
          }}
          mode="dark"
          component={Link}
          disabled={!metamaskSelected}
          to="/userdetails"
          label="Next: Introduce yourself!"
        />
      </Box>
    </Box>
  );
};

export default NewUser;
