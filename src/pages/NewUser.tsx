import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import BackButton from '../components/BackButton';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';

const NewUser: React.FunctionComponent = (props) => {
  const [metamaskSelected, setMetamaskSelected] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // const fetchData = async () => {};
    // fetchData();
  }, []);

  const handleInjectFromMetamaskClick = async () => {
    console.log('metamask clicc');
  };

  const handleNextClick = () => {
    history.push('userdetails');
  };

  const handleBackClick = async () => {
    history.goBack();
  };

  return (
    // <Box
    //   sx={{
    //     width: '100%',
    //     minHeight: '460px',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //   }}
    // >
    //   <>
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         width: '100%',
    //         mx: '2px',
    //       }}
    //     >
    //       <BackButton handleClick={handleBackClick} />
    //     </Box>
    //     <Box
    //       sx={{
    //         width: '100%',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //       }}
    //     >
    //       <Button onClick={handleInjectFromMetamaskClick}>Metamask</Button>

    //       <Button
    //         // disabled={!metamaskSelected}
    //         onClick={handleNextClick}
    //       >
    //         Next User Details
    //       </Button>
    //     </Box>
    //   </>
    // </Box>
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
        <AutButton startIcon={AutLogo} sx={{ mt: '29px' }} onClick={handleInjectFromMetamaskClick}>
          Inject from Metamask
        </AutButton>
        <AutButton disabled sx={{ mt: '30px' }}>
          Create Social Account
        </AutButton>
      </Box>
    </Box>
  );
};

export default NewUser;
