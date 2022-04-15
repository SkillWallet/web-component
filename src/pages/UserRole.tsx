import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { base64toFile, SwButton } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { currentCommunity } from '../store/sw-auth.reducer';
import { resetUIState } from '../store/store';
import { loadingFinished, setLoading, setLoadingMessage, startLoading } from '../store/sw-ui-reducer';
import { currentUserState, setCommitment, setRole } from '../store/sw-user-data.reducer';
import { isCoreTeamMember, joinCommunity } from '../services/web3/web3Service';
import { CustomSlider } from '../components/CustomSlider';
import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';
import BackButton from '../components/BackButton';
import { uploadFile } from '../services/textile/textile.hub';

interface Role {
  roleId: number;
  roleName: string;
}

// const defaultValues = {
//   commitment: 0,
// };

const UserRole: React.FunctionComponent = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);
  // const userState = useSelector(currentUserState);
  const swUserState = useSelector(currentUserState);
  const [memberRoles, setMemberRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(undefined);
  const [errorData, setErrorData] = useState(undefined);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: swUserState,
  });

  const onSubmit = async (data: any) => {
    dispatch(startLoading('Uploading user image.'));
    await uploadFile(await base64toFile(swUserState.profileImageUrl, 'avatar'))
      .then(async (result) => {
        dispatch(setLoadingMessage('Joining community.'));
        await joinCommunity(community.address, swUserState.username, result, selectedRole, data.commitment, dispatch)
          .then(() => {
            history.push('/qr');
            dispatch(loadingFinished());
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
                  dispatch(resetUIState);
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
            dispatch(loadingFinished());
          });
      })
      .catch((e) => {
        console.log(e);
        setErrorData({
          errorMessage: e.message,
          actionLabel: 'Retry',
          action: () => {
            setErrorData(undefined);
            handleSubmit(onSubmit)();
          },
        });
        dispatch(loadingFinished());
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(startLoading('Checking membership.'));
      await isCoreTeamMember(community.address, window.ethereum.selectedAddress)
        .then((result) => {
          const roles = community.properties.skills.roles || [];
          const newUserRolesBaseId = 4;
          const filteredRoles = roles
            .filter((r) => r.isCoreTeamMember === result && r.roleName !== '')
            .map((curr, index) => {
              const { roleName } = curr;
              let roleId: number;
              if (roleId <= 3) {
                roleId = curr.id;
              } else {
                roleId = newUserRolesBaseId + index;
              }
              return { roleId, roleName };
            });
          setMemberRoles(filteredRoles);
          dispatch(loadingFinished());
        })
        .catch((e) => {
          console.log(e);
          if (e.message === 'Already processing eth_requestAccounts. Please wait.') {
            e.message = ErrorTypes.GetAccountsInProgress;
          }
          setErrorData({
            errorMessage: e.message,
            actionLabel: 'Retry',
            action: () => {
              setErrorData(undefined);
              fetchData();
            },
          });
          dispatch(loadingFinished());
        });
    };
    fetchData();
  }, []);

  const handleRoleSelected = (role) => {
    dispatch(setRole(role.roleName));
    setSelectedRole(role);
  };

  const handleSliderChange = (value) => {
    console.log(value);
    dispatch(setCommitment(value));
  };

  const handleBackClick = async () => {
    if (selectedRole) {
      setSelectedRole(undefined);
    } else {
      history.goBack();
    }
  };

  return errorData ? (
    <ErrorBox errorData={errorData} />
  ) : (
    <Box
      sx={{
        minHeight: '462px',
        width: '100%',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignContent: 'center',
            my: '17px',
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
            mb: '9px',
          }}
        >
          <Box
            sx={{
              py: '24px',
              mt: `${memberRoles.length < 3 ? (selectedRole ? '' : '35px') : ''}`,
              mb: `${selectedRole ? '27px' : memberRoles.length < 3 ? '56px' : '27px'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gridGap: '20px',
              minWidth: '380px',
              maxHeight: '172px',
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
                <CustomSlider
                  name="commitment"
                  control={control}
                  onValueChange={handleSliderChange}
                  setValue={setValue}
                  rules={{ min: 1, max: 10 }}
                  defaultValue={swUserState.commitment}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gridGap: '20px',
                  minWidth: '380px',
                  maxHeight: '172px',
                }}
              >
                {memberRoles &&
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
                  })}
              </Box>
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
    </Box>
  );
};

export default UserRole;
