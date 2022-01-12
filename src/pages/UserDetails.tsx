import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link } from 'react-router-dom';
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { Form, Formik, isInputEvent } from 'formik';
import IPage from '../interfaces/page';
import { currentCommunity, setLoading } from '../store/sw-auth.reducer';
import { changeNetwork, fetchSkillWallet } from '../services/web3/web3Service';
import RemainingCharsTextInput from '../components/RemainingCharsTextInput';

const UserDetails: React.FunctionComponent<IPage> = (props) => {
  const [inputIsValid, setInputIsValid] = useState(false);
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);

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
        <Formik
          initialValues={{ username: '', text: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              // errors.email = 'Required';
            } else if (values.username.length > 19) {
              // errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={(values) => {
            setTimeout(() => {
              console.log(values);
            }, 400);
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Box
              sx={{
                maxWidth: '382px',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              component={Form}
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
                  border: 2,
                  borderColor: 'secondary',
                  mb: '18px',
                  px: '16px',
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    my: 'auto',
                  }}
                  variant="h4"
                >
                  How do you want your community to call you?
                </Typography>
                <Input
                  sx={{
                    my: 'auto',
                    height: '40px',
                    flex: 1,
                    border: 2,
                    borderColor: 'secondary',
                  }}
                  type="username"
                  name="username"
                  onChange={handleChange}
                  value={values.username}
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
                  border: 2,
                  borderColor: 'secondary',
                  mb: '24px',
                  px: '16px',
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    my: 'auto',
                  }}
                  variant="h4"
                >
                  A public image - that’s how others will see you.
                </Typography>
                <Input
                  sx={{
                    my: 'auto',
                    height: '40px',
                    flex: 1,
                    border: 2,
                    borderColor: 'secondary',
                  }}
                  type="file"
                  name="file"
                  onChange={handleChange}
                  value={values.username}
                />
              </Box>
              <SwButton
                sx={{
                  whiteSpace: 'nowrap',
                  borderColor: 'primary.main',
                  height: '75px',
                  maxWidth: '320px',
                }}
                mode="dark"
                component={Button}
                type="submit"
                disabled={inputIsValid}
                label="Next: Introduce yourself!"
              />
            </Box>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default UserDetails;
