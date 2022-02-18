import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton, asyncPoll } from 'sw-web-shared';
import { Box, Typography } from '@mui/material';
import { QRCode } from 'react-qrcode-logo';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import { fetchSkillWallet, getActivationNonce, getTokenId, isQrCodeActive } from '../services/web3/web3Service';
import {
  setLoading,
  currentCommunity,
  setLoggedIn,
  showDialog,
  resetState,
  setUserName,
  setUserProfilePicture,
} from '../store/sw-auth.reducer';
import ErrorBox from '../components/ErrorBox';

const ScanQR: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const community = useSelector(currentCommunity);
  const [qrData, setQrData] = useState(undefined);
  const [errorData, setErrorData] = useState(undefined);

  const pollQRCodeActivated = async (token) => {
    const fn = () => isQrCodeActive(token);
    const condition = (active: boolean) => !active;
    return asyncPoll<boolean>(fn, condition, 8000, 50);
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      await getTokenId()
        .then(async (token) => {
          await getActivationNonce(token.toString()).then(async (nonce) => {
            console.log('NONCE', nonce);
            setQrData({ tokenId: token.toString(), nonce });
            dispatch(setLoading(false));
            await pollQRCodeActivated(token).then(async (result) => {
              if (result) {
                const skillWallet = await fetchSkillWallet();
                window.sessionStorage.setItem('skillWallet', JSON.stringify(skillWallet));
                dispatch(setLoggedIn(true));
                dispatch(setUserName(skillWallet.nickname));
                dispatch(setUserProfilePicture(skillWallet.imageUrl));
                dispatch(showDialog(false));
                history.push('/');
                const event = new CustomEvent('onSkillwalletLogin', {
                  composed: true,
                  cancelable: true,
                  bubbles: true,
                  detail: true,
                });
                console.log('sending login event');
                window.dispatchEvent(event);
              } else {
                setErrorData({ message: 'QR not scanned.' });
              }
            });
          });
        })
        .catch((e) => {
          console.log(e);
          setErrorData({ message: 'Something went wrong' });
          dispatch(setLoading(false));
        });
    };
    fetchData();
  }, []);

  const handleError = () => {
    dispatch(resetState());
    history.push('/');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '460px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        py: '16px',
      }}
    >
      {errorData ? (
        <ErrorBox errorData={errorData} />
      ) : (
        <>
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
                mb: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gridGap: '20px',
                minWidth: '282px',
                minHeight: '251px',
                border: 2,
                borderColor: 'secondary',
                backgroundColor: '#FFFFFF',
              }}
            >
              {qrData && <QRCode size={250} logoImage={community} logoWidth={70} logoHeight={70} value={JSON.stringify(qrData)} />}
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
              maxWidth: '282px',
            }}
          >
            <Typography align="center" variant="h3" sx={{ color: '#000000', fontWeight: '400' }}>
              Scan with your{' '}
              <Typography variant="h3" component="span" sx={{ color: '#000000', fontWeight: '400', textDecorationLine: 'underline' }}>
                SkillWallet App{' '}
              </Typography>
              to Claim your{' '}
              <Typography variant="h3" component="span" sx={{ color: '#000000', fontWeight: '400', textDecorationLine: 'underline' }}>
                Membership!
              </Typography>
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ScanQR;
