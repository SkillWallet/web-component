import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { base64toFile, SwButton } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { currentCommunity } from '../store/sw-auth.reducer';
import { resetUIState } from '../store/store';
import { loadingFinished, setLoading, setLoadingMessage, startLoading } from '../store/sw-ui-reducer';
import { currentUserState, setCommitment, setRole } from '../store/sw-user-data.reducer';
import { CustomSlider } from '../components/CustomSlider';
import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';
import BackButton from '../components/BackButton';
import { uploadFile } from '../services/textile/textile.hub';

const UserRole: React.FunctionComponent = (props) => {
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  //  const onSubmit = async (data: any) => {};

  useEffect(() => {
    const fetchData = async () => {
      console.log('use Effect');
    };
    fetchData();
  }, []);

  const handleBackClick = async () => {
    history.goBack();
  };

  const goToCommitment = () => {
    history.push('commitment');
  };

  return errorData ? (
    <ErrorBox errorData={errorData} />
  ) : (
    <Box
      sx={{
        minHeight: '462px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
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
          mb: '9px',
        }}
      >
        <Button onClick={goToCommitment}>Next: Commitment</Button>
        {/* <SwButton
          sx={{
            borderColor: 'primary.main',
          }}
          btnType="large"
          mode="dark"
          component={Button}
          type="submit"
          disabled={!selectedRole}
          label="That's it - join this community!"
        /> */}
      </Box>
    </Box>
  );
};

export default UserRole;
