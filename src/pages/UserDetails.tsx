import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton, SwUploadFile, toBase64 } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Avatar, Box, Button, Input, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { Controller, useForm } from 'react-hook-form';
import { currentCommunity, partnerMode, swData } from '../store/sw-auth.reducer';
import { setLoading, loadingFinished, startLoading } from '../store/sw-ui-reducer';
import { currentUserState, setUserData } from '../store/sw-user-data.reducer';
import { uploadFile } from '../services/textile/textile.hub';
import { ReactComponent as Upload } from '../assets/upload.svg';
import { CustomInput } from '../components/CustomInput';
import ErrorBox from '../components/ErrorBox';
import BackButton from '../components/BackButton';

interface Values {
  picture?: File;
  text: string;
}

const UserDetails: React.FunctionComponent = (props) => {
  const swState = useSelector(swData);
  const [swUserState] = useState(useSelector(currentUserState));
  const [errorData, setErrorData] = useState(undefined);
  const history = useHistory();
  const dispatch = useDispatch();
  console.log(swUserState);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: swUserState,
  });

  const onSubmit = async (data) => {
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
              <Input type="text" placeholder="nickname" />

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
                  name="profileImageUrl"
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
              <Button
                type="submit"
                onClick={goToRole}
                // disabled={!isValid}
              >
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
