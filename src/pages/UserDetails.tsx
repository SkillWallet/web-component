import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Avatar, Box, Button, Input, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import { currentCommunity, setLoading, partnerMode, setUserName, setUserProfilePicture, resetState } from '../store/sw-auth.reducer';
import { pushImage } from '../services/textile/textile.hub';
import { ReactComponent as Upload } from '../assets/upload.svg';
import { CustomInput } from '../components/CustomInput';
import ErrorBox from '../components/ErrorBox';

interface Values {
  picture?: File;
  text: string;
}

const UserDetails: React.FunctionComponent = (props) => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });
  const [image, setImage] = useState(undefined);
  const [errorData, setErrorData] = useState(undefined);
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);
  const isPartner = useSelector(partnerMode);

  const parseImage = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = e.target?.result;
      setImage(img as any);
    };
    if (event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
  };

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    await pushImage(data.picture[0], 'profile.png')
      .then((result) => {
        dispatch(setUserProfilePicture(result));
        dispatch(setUserName(data.username));
        history.push('/role');
        dispatch(setLoading(false));
      })
      .catch((e) => {
        setErrorData({ message: 'Something went wrong.' });
        dispatch(setLoading(false));
      });
  };

  const handleError = () => {
    dispatch(resetState());
    history.push('/');
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
        py: '16px',
      }}
    >
      {errorData ? (
        <ErrorBox errorMessage={errorData.message} action={handleError} />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            {isPartner ? (
              <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                Great! Now let's start - tell us about yourself
              </Typography>
            ) : (
              <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                Welcome to{' '}
                <Typography variant="h2" component="span" sx={{ fontWeight: '400', textDecorationLine: 'underline' }}>
                  {community.name}
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
                  <CustomInput maxLength={12} name="username" control={control} setValue={setValue} rules={{ required: true }} />
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
                  <Button
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
                  </Button>
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
      )}
    </Box>
  );
};

export default UserDetails;
