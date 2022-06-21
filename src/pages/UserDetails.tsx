import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwUploadFile, toBase64 } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { ReactComponent as Upload } from '../assets/upload.svg';
import BackButton from '../components/BackButton';
import { setUserData } from '../store/user-data.reducer';

interface Values {
  picture?: File;
  text: string;
}

const UserDetails: React.FunctionComponent = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { username: '', picture: null },
  });

  const onSubmit = async (data) => {
    console.log(data);
    dispatch(setUserData(data));
    history.push('/role');
  };

  const handleBackClick = async () => {
    history.goBack();
  };

  const goToRole = () => {
    history.push('/role');
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
      <>
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
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                maxWidth: '382px',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Controller
                name="username"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => <TextField onChange={onChange} value={value} label="username" />}
              />
              <Box
                sx={{
                  height: '96px',
                  alignContent: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  backgroundColor: '#FFFFFF',
                  mb: '24px',
                  px: '16px',
                }}
              >
                <Controller
                  name="picture"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange }, fieldState, formState }) => {
                    return (
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '75px' }}>
                        <SwUploadFile
                          mode="dark"
                          variant="rounded"
                          name={name}
                          initialPreviewUrl={value}
                          fileChange={async (file) => {
                            if (file) {
                              onChange(await toBase64(file));
                            } else {
                              onChange(null);
                            }
                          }}
                          defaulUploadIcon={<Upload style={{ fontSize: 30, fill: 'black' }} />}
                          sx={{
                            width: '50px',
                            height: '50px',
                          }}
                        />
                        {!value ? (
                          <Typography variant="h4" sx={{ textTransform: 'none', mt: '10px', color: '#454A4D' }}>
                            .png or .jpg
                          </Typography>
                        ) : (
                          ''
                        )}
                      </Box>
                    );
                  }}
                />
              </Box>
              {console.log(isValid)}
              <Button type="submit" disabled={!isValid}>
                Next: Role
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </Box>
  );
};

export default UserDetails;
