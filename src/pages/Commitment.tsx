import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, Slider } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { setCommitment } from '../store/sw-user-data.reducer';
import BackButton from '../components/BackButton';
import { setUserData, userData } from '../store/user-data.reducer';
import { useAppDispatch } from '../store/store.model';
import { mintMembership } from '../services/web3/api';

interface Role {
  roleId: number;
  roleName: string;
}

const Commitment: React.FunctionComponent = (props) => {
  const history = useHistory();
  const userInput = useSelector(userData);
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { commitment: 0 },
  });

  const onSubmit = async (data: any) => {
    dispatch(mintMembership({ userData: userInput, commitment: data.commitment }));
  };

  useEffect(() => {
    console.log(userInput);
  }, [userInput]);

  const handleSliderChange = (value) => {
    console.log(value);
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
          <Controller
            name="commitment"
            control={control}
            rules={{ required: true, min: 1, max: 10 }}
            render={({ field: { onChange, value } }) => (
              <Slider
                min={0}
                max={10}
                onChange={(e, v) => {
                  console.log(v);
                  return onChange(v);
                }}
                value={value}
              />
            )}
          />
          {/* <Slider /> */}
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
          disabled={!isValid}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Commitment;
