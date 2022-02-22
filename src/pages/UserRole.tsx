import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { currentCommunity, setLoading, currentUsername, setTokenId, profileImageUrl, resetState } from '../store/sw-auth.reducer';
import { isCoreTeamMember, joinCommunity } from '../services/web3/web3Service';
import { CustomSlider } from '../components/CustomSlider';
import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';

interface Role {
  roleId: number;
  roleName: string;
}

const defaultValues = {
  commitment: 0,
};

const UserRole: React.FunctionComponent = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);
  const username = useSelector(currentUsername);
  const profilePictureUrl = useSelector(profileImageUrl);
  const [memberRoles, setMemberRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(undefined);
  const [errorData, setErrorData] = useState(undefined);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({ defaultValues });

  const onSubmit = async (data: any) => {
    console.log(data);
    dispatch(setLoading(true));
    await joinCommunity(community.address, username, profilePictureUrl, selectedRole, data.commitment)
      .then((result) => {
        history.push('/qr');
        dispatch(setLoading(false));
      })
      .catch((e) => {
        if (
          e.message === ErrorTypes.CommunitySlotsFull ||
          e.message === ErrorTypes.AlreadyAMember ||
          e.message === ErrorTypes.SkillWalletWithThisAddressAlreadyRegistered
        ) {
          setErrorData({
            errorMessage: e.message,
            actionLabel: 'Back to Home',
            action: () => {
              dispatch(resetState());
              history.push('/');
            },
          });
        } else {
          console.log(e);
          setErrorData({
            errorMessage: e.message,
            actionLabel: 'Retry',
            action: () => {
              setErrorData(undefined);
              handleSubmit(onSubmit)();
            },
          });
        }
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      console.log(community.address, window.ethereum.selectedAddress);
      await isCoreTeamMember(community.address, window.ethereum.selectedAddress)
        .then((result) => {
          const roles = community?.roles?.roles || [];
          const newUserRolesBaseId = 4;
          const filteredRoles = roles
            .filter((r) => r.isCoreTeamMember === result)
            .map((curr, index) => {
              console.log(curr);
              const { roleName } = curr;
              let roleId;
              if (roleId <= 3) {
                roleId = curr.roleId;
              } else {
                roleId = newUserRolesBaseId + index;
              }
              return { roleId, roleName };
            });
          setMemberRoles(filteredRoles);
          dispatch(setLoading(false));
        })
        .catch((e) => {
          console.log(e);
          setErrorData({
            errorMessage: e.message,
            actionLabel: 'Retry',
            action: () => {
              setErrorData(undefined);
              fetchData();
            },
          });
          dispatch(setLoading(false));
        });
    };
    fetchData();
  }, []);

  const handleRoleSelected = (role) => {
    console.log(role);
    setSelectedRole(role);
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
        <ErrorBox errorData={errorData} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
              Your Role in{' '}
              <Typography variant="h2" component="span" sx={{ fontWeight: '600', textDecorationLine: 'underline' }}>
                {community.name}
              </Typography>
              !
            </Typography>
            <Typography align="center" variant="h3" sx={{ fontWeight: '400', maxWidth: '320px' }}>
              Pick what you're best at, & be rewareded for it!
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
            <Box
              sx={{
                py: '24px',
                mb: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gridGap: '20px',
                minWidth: '380px',
                maxHeight: '210px',
                border: 2,
                borderColor: 'secondary',
                backgroundColor: '#FFFFFF',
              }}
            >
              {selectedRole ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '212px',
                    border: 2,
                    borderColor: '#000000',
                    backgroundColor: '#FFFFFF',
                    pb: '10px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '44px',
                      width: '100%',
                      color: 'secondary',
                      backgroundColor: '#000000',
                    }}
                  >
                    <Typography
                      align="center"
                      sx={{
                        alignContent: 'center',
                        color: 'secondary',
                        fontWeight: '400',
                      }}
                      variant="h1"
                    >
                      {(selectedRole as Role).roleName}
                    </Typography>
                  </Box>

                  <Typography align="center" variant="h4" sx={{ color: '#000000', fontWeight: '400', maxWidth: '320px', my: '12px' }}>
                    Your{' '}
                    <Typography variant="h4" component="span" sx={{ color: '#000000', fontWeight: '600', textDecorationLine: 'underline' }}>
                      Commitment Level
                    </Typography>
                  </Typography>
                  <Typography align="center" variant="h5" sx={{ color: '#000000', fontWeight: '400', maxWidth: '320px', mb: '12px' }}>
                    Tell your community how much time you commit to this Role!
                  </Typography>
                  <CustomSlider name="commitment" control={control} setValue={setValue} rules={{ min: 1, max: 10 }} />
                </Box>
              ) : (
                memberRoles &&
                memberRoles.map((role: Role, index) => {
                  return (
                    <SwButton
                      key={index}
                      sx={{
                        maxWidth: '212px',
                        maxHeight: '44px',
                      }}
                      className={selectedRole && selectedRole.roleId === role.roleId ? 'active-link' : ''}
                      mode="dark"
                      btnType="large"
                      onClick={() => handleRoleSelected(role)}
                    >
                      <Typography variant="h3">{role.roleName}</Typography>
                    </SwButton>
                  );
                })
              )}
            </Box>
            <SwButton
              sx={{
                borderColor: 'primary.main',
              }}
              btnType="large"
              mode="dark"
              component={Button}
              type="submit"
              disabled={!isValid || !selectedRole}
              label="That's it - join this community!"
            />
          </Box>
        </form>
      )}
    </Box>
  );
};

export default UserRole;
