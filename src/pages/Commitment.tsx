import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { base64toFile, SwButton } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Slider, Typography } from '@mui/material';
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

interface Role {
  roleId: number;
  roleName: string;
}

const Commitment: React.FunctionComponent = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    // defaultValues: swUserState,
  });

  const onSubmit = async (data: any) => {
    console.log('submit');
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData');
    };
    fetchData();
  }, []);

  const handleSliderChange = (value) => {
    console.log(value);
    dispatch(setCommitment(value));
  };

  const handleBackClick = async () => {
    history.goBack();
  };

  return (
    <Box
      sx={{
        minHeight: '462px',
        width: '100%',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <BackButton handleClick={handleBackClick} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Slider />
          {/* <CustomSlider
            name="commitment"
            control={control}
            onValueChange={handleSliderChange}
            setValue={setValue}
            rules={{ min: 1, max: 10 }}
            defaultValue={}
          /> */}
        </Box>
        <Button
          type="submit"
          // onClick={goToRole}
          // disabled={!isValid}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Commitment;
