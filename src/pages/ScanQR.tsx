import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton, asyncPoll } from 'sw-web-shared';
import { Box, Typography } from '@mui/material';
import { QRCode } from 'react-qrcode-logo';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import { getActivationNonce, isQrCodeActive } from '../services/web3/web3Service';
import { setLoading, currentTokenId, currentCommunity, setLoggedIn, showDialog, resetState } from '../store/sw-auth.reducer';
import ErrorBox from '../components/ErrorBox';

const ScanQR: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const tokenId = useSelector(currentTokenId);
  const community = useSelector(currentCommunity);
  console.log('Token Id', tokenId);
  const [nonce, setNonce] = useState(undefined);
  const [errorData, setErrorData] = useState(undefined);

  const pollQRCodeActivated = async () => {
    const { ethereum } = window;
    if (ethereum.selectedAddress) {
      const fn = () => isQrCodeActive(tokenId);
      const condition = (active: boolean) => !active;
      return asyncPoll<boolean>(fn, condition, 8000, 50);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      const newNonce = await getActivationNonce(tokenId)
        .then(async (result) => {
          setNonce(newNonce);
          dispatch(setLoading(false));
          return result;
        })
        .catch((e) => {
          setErrorData({ message: 'Something went wrong' });
          dispatch(setLoading(false));
        });
      const isActive = await pollQRCodeActivated();
      dispatch(setLoggedIn(true));
      dispatch(showDialog(false));
      history.push('/');
    };
    if (tokenId) fetchData();
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
        <ErrorBox errorMessage={errorData.message} action={handleError} />
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
              {nonce && (
                <QRCode
                  size={250}
                  logoImage={community}
                  value={JSON.stringify({
                    tokenId,
                    nonce,
                  })}
                />
              )}
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
