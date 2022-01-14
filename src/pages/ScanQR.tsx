import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Button, Input, Slider, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import { QRCode } from 'react-qrcode-logo';
import IPage from '../interfaces/page';
import { currentCommunity, setLoading } from '../store/sw-auth.reducer';
import { getActivationNonce, isCoreTeamMember, joinCommunity } from '../services/web3/web3Service';
import RemainingCharsTextInput from '../components/RemainingCharsTextInput';
import { pushImage } from '../services/textile/textile.hub';
import { currentTokenId } from '../store/sw-user-data.reducer';
import { CustomSlider } from '../components/CustomSlider';
// {"nonce":386799233,"action":0}
const rolesIds = {
  Founder: 1,
  Contributor: 2,
  Investor: 3,
};

interface Role {
  roleId: number;
  roleName: string;
}

const defaultValues = {
  commitment: 0,
};

const ScanQR: React.FunctionComponent<IPage> = (props) => {
  const tokenId = useSelector(currentTokenId);
  useEffect(() => {
    const fetchData = async () => {
      console.log('fetching nonce');
      const nonce = await getActivationNonce(tokenId);
      if (tokenId) {
        console.log(tokenId);
        console.log(nonce);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '460px',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: 'center',
        py: '16px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            py: '24px',
            mb: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gridGap: '20px',
            minWidth: '282px',
            border: 2,
            borderColor: 'secondary',
            backgroundColor: '#FFFFFF',
          }}
        >
          <QRCode value="386799233" />
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          minWidth: '282px',
          height: '69px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography align="center" variant="h2" sx={{ color: '#000000', fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
          Scan with your{' '}
          <Typography variant="h2" component="span" sx={{ color: '#000000', fontWeight: '400', textDecorationLine: 'underline' }}>
            SkillWallet App{' '}
          </Typography>
          to Claim your{' '}
          <Typography variant="h2" component="span" sx={{ color: '#000000', fontWeight: '400', textDecorationLine: 'underline' }}>
            Membership!
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default ScanQR;
