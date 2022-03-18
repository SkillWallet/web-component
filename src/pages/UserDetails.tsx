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
    if (swState.isPartner) {
      history.push('/partnerRole');
    } else {
      history.push('/role');
    }
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
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {swState.isPartner ? (
              <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                Great! Now let's start - tell us about yourself
              </Typography>
            ) : (
              <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                Welcome to{' '}
                <Typography variant="h2" component="span" sx={{ fontWeight: '400', textDecorationLine: 'underline' }}>
                  {swState.community.name}
                </Typography>
                !
              </Typography>
            )}

            <Typography align="center" variant="h3" sx={{ fontWeight: '400', maxWidth: '320px' }}>
              Tell us about you
            </Typography>
          </Box>

          <Box
            sx={{
              width: '45px',
              height: '45px',
            }}
          />
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
              <Box sx={{ width: '382px', mb: '18px' }}>
                <Typography variant="h4" sx={{ fontWeight: '400', textDecorationLine: 'underline' }}>
                  Nickname
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  height: '68px',
                  display: 'flex',
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  mb: '18px',
                  px: '16px',
                }}
              >
                <Typography sx={{ color: '#707070', flex: 1, my: 'auto' }} variant="h4">
                  How do you want your community to call you?
                </Typography>
                <CustomInput
                  maxLength={12}
                  name="username"
                  control={control}
                  setValue={setValue}
                  rules={{ required: true }}
                  defaultValue={swUserState.username}
                />
              </Box>
              <Box sx={{ width: '382px', mb: '18px' }}>
                <Typography variant="h3" sx={{ fontWeight: '400', textDecorationLine: 'underline' }}>
                  Avatar
                </Typography>
              </Box>
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
                <Typography sx={{ color: '#707070', flex: 1, my: 'auto' }} variant="h4">
                  A public image - that’s how others will see you.
                </Typography>
                {/* <Button
                    disableElevation
                    sx={{
                      ':hover': {
                        backgroundColor: 'transparent',
                      },
                      backgroundColor: 'transparent',
                      my: 'auto',
                      flex: 1,
                      width: '70px',
                      height: '70px',
                    }}
                    variant="contained"
                    component="label"
                  >
                    <Box
                      sx={{
                        backgroundColor: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        ml: '70px',
                      }}
                    >
                      {image ? (
                        <Avatar
                          sx={{ border: 2, borderColor: '#000000', borderRadius: '100px', width: '51px', height: '51px' }}
                          src={image}
                        />
                      ) : (
                        <>
                          <Upload />
                          <Typography variant="h4" sx={{ textTransform: 'none', mt: '10px', color: '#454A4D' }}>
                            .png or .jpg
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Input
                      sx={{
                        display: 'none',
                      }}
                      {...register('picture', {
                        required: true,
                        onChange: (e) => {
                          parseImage(e);
                        },
                      })}
                      type="file"
                      inputProps={{ accept: '.png, .jpg' }}
                    />
                  </Button> */}
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
              <SwButton
                sx={{
                  borderColor: 'primary.main',
                  height: '75px',
                  maxWidth: '320px',
                }}
                mode="dark"
                component={Button}
                type="submit"
                disabled={!isValid}
                label="Next: Pick your Role"
              />
            </Box>
          </form>
        </Box>
      </>
    </Box>
  );
};

export default UserDetails;
