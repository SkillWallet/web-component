import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import BackButton from '../components/BackButton';

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
    <Box
      sx={{
        width: '100%',
        minHeight: '460px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            mx: '2px',
          }}
        >
          <BackButton handleClick={handleBackClick} />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button onClick={handleInjectFromMetamaskClick}>Metamask</Button>

          <Button
            // disabled={!metamaskSelected}
            onClick={handleNextClick}
          >
            Next User Details
          </Button>
        </Box>
      </>
    </Box>
  );
};

export default NewUser;
