import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton, asyncPoll } from 'sw-web-shared';
import { Box, Typography } from '@mui/material';
import { QRCode } from 'react-qrcode-logo';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import { fetchSkillWallet, getActivationNonce, getTokenId, isQrCodeActive } from '../services/web3/web3Service';
import { currentCommunity } from '../store/sw-auth.reducer';
import { loadingFinished, setLoading, showDialog, startLoading } from '../store/sw-ui-reducer';
import { setUserData } from '../store/sw-user-data.reducer';
import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';
import { OutputEventTypes } from '../types/event-types';
import { dispatchSwEvent } from '../utils/utils';

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
      dispatch(startLoading('Generating activation QR.'));
      await getTokenId()
        .then(async (token) => {
          await getActivationNonce(token.toString()).then(async (nonce) => {
            console.log('NONCE', nonce);
            setQrData({ tokenId: token.toString(), nonce });
            dispatch(loadingFinished());
            await pollQRCodeActivated(token).then(async (result) => {
              if (result) {
                dispatchSwEvent(OutputEventTypes.SkillWalletActivated, true);
                const sw = await fetchSkillWallet();
                window.sessionStorage.setItem('skillWallet', JSON.stringify(sw));
                dispatch(
                  setUserData({
                    username: sw.nickname,
                    profileImageUrl: sw.imageUrl,
                    isLoggedIn: true,
                  })
                );
                dispatch(showDialog(false));
                dispatchSwEvent(OutputEventTypes.Login, true);
              } else {
                setErrorData({
                  errorMessage: 'QR Code not scanned.',
                  actionLabel: 'Retry',
                  action: () => {
                    setErrorData(undefined);
                    fetchData();
                  },
                });
              }
            });
          });
        })
        .catch((e) => {
          console.log(e);
          if (e.message === ErrorTypes.CouldNotGetActivationNonce) {
            setErrorData({
              errorMessage: 'Could not retreave activation nonce.',
              actionLabel: 'Retry',
              action: () => {
                setErrorData(undefined);
                fetchData();
              },
            });
          } else {
            if (e.message === 'Already processing eth_requestAccounts. Please wait.') {
              e.message = ErrorTypes.GetAccountsInProgress;
            }
            setErrorData({
              errorMessage: e.message,
              actionLabel: 'Retry',
              action: () => {
                setErrorData(undefined);
                fetchData();
              },
            });
          }
          dispatch(loadingFinished());
        });
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '429px',
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
              {qrData && <QRCode size={250} value={JSON.stringify(qrData)} />}
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
