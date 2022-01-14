import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import IPage from '../interfaces/page';
import { currentCommunity, setLoading } from '../store/sw-auth.reducer';
import { changeNetwork, fetchSkillWallet } from '../services/web3/web3Service';
import RemainingCharsTextInput from '../components/RemainingCharsTextInput';
import { pushImage } from '../services/textile/textile.hub';
import { setUserName, setUserProfilePicture } from '../store/sw-user-data.reducer';
import { ReactComponent as Upload } from '../assets/upload.svg';

interface Values {
  file?: File;
  text: string;
}

const UserDetails: React.FunctionComponent<IPage> = (props) => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });
  const [inputIsValid, setInputIsValid] = useState(false);
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);

  const onSubmit = async (data) => {
    const imageUrl = await pushImage(data.picture[0], 'profile.png');
    dispatch(setUserProfilePicture(imageUrl));
    dispatch(setUserName(data.username));
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
        py: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
          Welcome to{' '}
          <Typography variant="h2" component="span" sx={{ fontWeight: '400', textDecorationLine: 'underline' }}>
            {community.name}
          </Typography>
          !
        </Typography>
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
                backgroundColor: '#FFFFFF',
                mb: '18px',
                px: '16px',
              }}
            >
              <Typography sx={{ color: '#707070', flex: 1, my: 'auto' }} variant="h4">
                How do you want your community to call you?
              </Typography>
              <Input
                sx={{
                  color: '#000000',
                  my: 'auto',
                  height: '40px',
                  flex: 1,
                  border: 2,
                  borderColor: '#000000',
                }}
                type="text"
                {...register('username', { required: true })}
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
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Upload />
                  <Typography sx={{ color: '#454A4D' }} variant="subtitle2">
                    .png or .jpg
                  </Typography>
                </Box>
                <Input
                  sx={{
                    display: 'none',
                  }}
                  {...register('picture', { required: true })}
                  type="file"
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
              label="Next: Introduce yourself!"
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UserDetails;
