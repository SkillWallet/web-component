import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, Slider } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { setCommitment } from '../store/sw-user-data.reducer';
import BackButton from '../components/BackButton';

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
    defaultValues: { commitment: 0 },
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
          <Controller
            name="commitment"
            control={control}
            rules={{ required: true, min: 1, max: 100 }}
            render={({ field: { onChange, value } }) => (
              <Slider
                min={0}
                max={100}
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
