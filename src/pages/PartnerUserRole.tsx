import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { base64toFile, SwButton } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { currentCommunity } from '../store/sw-auth.reducer';
import { resetUIState } from '../store/store';
import { loadingFinished, setLoading, startLoading } from '../store/sw-ui-reducer';
import { currentUserState } from '../store/sw-user-data.reducer';
import { isCoreTeamMember, joinCommunity } from '../services/web3/web3Service';
import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';
import BackButton from '../components/BackButton';
import { uploadFile } from '../services/textile/textile.hub';

interface Role {
  roleId: number;
  roleName: string;
}

const PartnerUserRole: React.FunctionComponent = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [errorData, setErrorData] = useState(undefined);
  const community = useSelector(currentCommunity);
  const userState = useSelector(currentUserState);
  const [memberRoles, setMemberRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(startLoading('Checking membership.'));
      await isCoreTeamMember(community.communityAddress, window.ethereum.selectedAddress)
        .then((result) => {
          const { roles } = community.properties.skills;
          const newUserRolesBaseId = 4;
          const filteredRoles = roles
            .filter((r) => r.isCoreTeamMember === result)
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

  const handleJoinClicked = async () => {
    dispatch(startLoading('Uploading user image.'));
    const timeout = setTimeout(() => {
      dispatch(startLoading('Uploading user image is taking longer than expected, please be patient.'));
    }, 60 * 1000);
    await uploadFile(await base64toFile(userState.profileImageUrl, 'avatar'))
      .then(async (imageUrl) => {
        clearTimeout(timeout);
        await joinCommunity(community.address, userState.username, imageUrl, selectedRole, 10, dispatch)
          .then(async (result) => {
            console.log('successful join');
            history.push('/qr');
          })
          .catch((e) => {
            console.log(e);
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
                  handleJoinClicked();
                },
              });
            }
            dispatch(loadingFinished());
          });
      })
      .catch((e) => {
        clearTimeout(timeout);
        console.log(e);
        setErrorData({
          errorMessage: e.message,
          actionLabel: 'Retry',
          action: () => {
            setErrorData(undefined);
            handleJoinClicked();
          },
        });
        dispatch(loadingFinished());
      });
  };

  const handleRoleSelected = (role) => {
    setSelectedRole(role);
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
        py: '16px',
      }}
    >
      {errorData ? (
        <ErrorBox errorData={errorData} />
      ) : (
        <>
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography align="center" variant="h2" sx={{ fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                Pick your Role in your Community - and let it be known for the generations to come!
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
            <Box
              sx={{
                py: '24px',
                mb: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gridGap: '20px',
                minWidth: '383px',
                border: 2,
                borderColor: 'secondary',
                backgroundColor: '#FFFFFF',
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
            <SwButton
              sx={{
                whiteSpace: 'nowrap',
                borderColor: 'primary.main',
                height: '75px',
                maxWidth: '383px',
              }}
              mode="dark"
              component={Button}
              onClick={handleJoinClicked}
              disabled={!selectedRole}
              label="That's it - join this community!"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PartnerUserRole;
