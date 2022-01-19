import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton, asyncPoll } from 'sw-web-shared';
import { Box, Typography } from '@mui/material';
import { QRCode } from 'react-qrcode-logo';
import { ethers } from 'ethers';
import { getActivationNonce, isQrCodeActive } from '../services/web3/web3Service';
import { setLoading, currentTokenId } from '../store/sw-auth.reducer';

const ScanQR: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const tokenId = useSelector(currentTokenId);
  console.log('Token Id', tokenId);
  const [nonce, setNonce] = useState(undefined);

  useEffect(() => {
    console.log('Token Id', tokenId);
  }, [tokenId]);

  const pollQRCodeActivated = async () => {
    const { ethereum } = window;
    if (ethereum.selectedAddress) {
      console.log('ADDRESS?');
      const web3Provider = new ethers.providers.Web3Provider(ethereum);
      const fn = () => isQrCodeActive(web3Provider, ethereum.selectedAddress as string, tokenId);
      const condition = (active: boolean) => !active;
      console.log(tokenId);
      const isActive = await asyncPoll<boolean>(fn, condition, 8000, 50);

      console.log(isActive);
      return isActive;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      console.log('fetching nonce');
      console.log(tokenId);
      const newNonce = await getActivationNonce(tokenId);
      console.log(newNonce);
      setNonce(newNonce);
      // if (nonce) {
      //   console.log(tokenId);
      //   console.log(nonce);
      // }
      dispatch(setLoading(false));
      const isActive = await pollQRCodeActivated();
      console.log(isActive);
    };
    console.log(tokenId);
    if (tokenId) fetchData();
    // const pollQRScan = async () => {
    //   const isActive = await pollQRCodeActivated(tokenId);
    //   console.log(isActive);
    // };
    // pollQRScan();
  }, [tokenId]);

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
          {nonce && <QRCode value={`${nonce}`} />}
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
