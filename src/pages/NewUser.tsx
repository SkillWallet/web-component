import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  currentCommunity,
  setLoading,
  partnerMode,
  setLoggedIn,
  setUserProfilePicture,
  setUserName,
  setCommunity,
  currentPartnerKey,
  resetState,
} from '../store/sw-auth.reducer';
import { getCommunity } from '../services/web3/web3Service';
import { ReactComponent as MetaMaskIcon } from '../assets/metamask.svg';
import { ReactComponent as PortisIcon } from '../assets/portis_icon.svg';
import ErrorBox from '../components/ErrorBox';

const NewUser: React.FunctionComponent = (props) => {
  const [metamaskSelected, setMetamaskSelected] = useState(false);
  const [errorData, setErrorData] = useState(undefined);
  const history = useHistory();
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);
  const partnerKey = useSelector(currentPartnerKey);
  const isPartner = useSelector(partnerMode);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      await getCommunity(partnerKey)
        .then((result) => {
          console.log('community', result);
          dispatch(setCommunity(result));
          dispatch(setLoading(false));
        })
        .catch((e) => {
          setErrorData({ message: 'Unable to fetch community.' });
          dispatch(setLoading(false));
        });
    };
    fetchData();
  }, []);

  const handleInjectFromMetamaskClick = async () => {
    const { ethereum } = window;
    try {
      if (ethereum.request) {
        const result = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log(result);
        // figure out where to store this
        setMetamaskSelected(true);
      }
    } catch (error) {
      setErrorData({ message: 'Failed to retrieve MetaMask account' });
      //   this.onSkillwalletError.emit();
      //   alert(error);
    }
  };

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
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {errorData ? (
        <ErrorBox errorMessage={errorData.message} action={handleError} />
      ) : (
        <>
          {community && (
            <>
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
