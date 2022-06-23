import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, Slider, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { setCommitment } from '../store/sw-user-data.reducer';
import BackButton from '../components/BackButton';
import { setUserData, userData } from '../store/user-data.reducer';
import { useAppDispatch } from '../store/store.model';
import { mintMembership } from '../services/web3/api';
import AutLogo from '../components/AutLogo';
import { AutSlider } from '../components/CommitmentSlider';
import { AutButton } from '../components/AutButton';

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
    formState: { isValid, errors },
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
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mt: '40px' }}>
        <AutLogo />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        YOU PICKED {userInput.roleName}
      </Typography>
      <Typography sx={{ mt: '25px' }} variant="h4">
        Tell your community how much
      </Typography>
      <Typography variant="h4">Time you can commit to this role</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mt: '56px' }}>
          <Controller
            name="commitment"
            control={control}
            rules={{ required: true, min: 1, max: 10 }}
            render={({ field: { name, value, onChange } }) => (
              <AutSlider
                value={value}
                name={name}
                errors={errors}
                sliderProps={{
                  defaultValue: 0,
                  step: 1,
                  marks: true,
                  name,
                  value: value || 0,
                  onChange,
                  min: 0,
                  max: 10,
                }}
              />
              // <Slider
              //   min={0}
              //   max={10}
              //   onChange={(e, v) => {
              //     console.log(v);
              //     return onChange(v);
              //   }}
              //   value={value}
              // />
            )}
          />
        </Box>
      </form>
      <AutButton sx={{ mt: '56px' }} type="submit" disabled={!isValid}>
        Join the Community
      </AutButton>
    </Box>
  );
};

export default Commitment;
