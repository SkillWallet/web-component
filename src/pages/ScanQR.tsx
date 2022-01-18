import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Button, Input, Slider, TextField, Typography } from '@mui/material';
import { QRCode } from 'react-qrcode-logo';
import IPage from '../interfaces/page';
import { getActivationNonce } from '../services/web3/web3Service';
import { currentTokenId } from '../store/sw-user-data.reducer';

const ScanQR: React.FunctionComponent<IPage> = (props) => {
  const tokenId = useSelector(currentTokenId);
  const [nocne, setNonce] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      console.log('fetching nonce');
      const nonce = await getActivationNonce(tokenId);
      setNonce(nonce);
      // if (nonce) {
      //   console.log(tokenId);
      //   console.log(nonce);
      // }
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
          <QRCode value={nocne} />
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
