import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { setLoading, setCommunity, resetState, swData } from '../store/sw-auth.reducer';
import { fetchSkillWallet, getCommunity } from '../services/web3/web3Service';
import { ReactComponent as MetaMaskIcon } from '../assets/metamask.svg';
import { ReactComponent as PortisIcon } from '../assets/portis_icon.svg';
import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';

const NewUser: React.FunctionComponent = (props) => {
  const [metamaskSelected, setMetamaskSelected] = useState(false);
  const [errorData, setErrorData] = useState(undefined);
  const history = useHistory();
  const dispatch = useDispatch();
  const swState = useSelector(swData);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      await getCommunity(swState.partnerKey)
        .then((result) => {
          console.log('community', result);
          dispatch(setCommunity(result));
          dispatch(setLoading(false));
        })
        .catch((e) => {
          console.log(e);
          setErrorData({
            errorMessage: e.message,
            actionLabel: 'Retry',
            action: () => {
              setErrorData(undefined);
            },
          });
          dispatch(setLoading(false));
        });
    };
    fetchData();
  }, []);

  const handleInjectFromMetamaskClick = async () => {
    if (!metamaskSelected) {
      dispatch(setLoading(true));
      await fetchSkillWallet()
        .then((wallet) => {
          if (wallet) {
            setErrorData({
              errorMessage: 'There is already a SkillWallet owned by this address.',
              actionLabel: 'Go back',
              action: () => {
                dispatch(resetState());
                history.push('/');
              },
            });
            dispatch(setLoading(false));
          }
        })
        .catch((e) => {
          if (e.message === ErrorTypes.SkillWalletExistsButInactive) {
            dispatch(setLoading(false));
            history.push('/qr');
          } else if (e.message === ErrorTypes.SkillWalletNotFound) {
            setMetamaskSelected(true);
            dispatch(setLoading(false));
          } else {
            console.log(e);
            dispatch(setLoading(false));
            setErrorData({
              errorMessage: e.message,
              actionLabel: 'Retry',
              action: () => {
                setErrorData(undefined);
                handleInjectFromMetamaskClick();
              },
            });
          }
        });
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
      {errorData ? (
        <ErrorBox errorData={errorData} />
      ) : (
        <>
          {swState && swState.community && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                {swState.isPartner ? (
                  <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                    Hello, Partner!
                  </Typography>
                ) : (
                  <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                    Welcome to{' '}
                    <Typography variant="h2" component="span" sx={{ fontWeight: '400', textDecorationLine: 'underline' }}>
                      {swState.community.name}
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
                    borderColor: 'primary.main',
                  }}
                  className={metamaskSelected ? 'active-link' : ''}
                  btnType="large"
                  startIcon={<MetaMaskIcon />}
                  mode="dark"
                  onClick={handleInjectFromMetamaskClick}
                  label="Inject from Metamask"
                />
                <SwButton
                  sx={{
                    borderColor: 'primary.main',
                  }}
                  btnType="large"
                  startIcon={<PortisIcon />}
                  mode="dark"
                  component={Link}
                  to="/"
                  label="Import Social Account"
                  disabled
                />
                <SwButton
                  sx={{
                    borderColor: 'primary.main',
                  }}
                  btnType="large"
                  mode="dark"
                  component={Link}
                  disabled={!metamaskSelected}
                  to="/userdetails"
                  label="Next: Introduce yourself!"
                />
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default NewUser;
