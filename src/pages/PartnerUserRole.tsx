import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ethers } from 'ethers';
import {
  currentCommunity,
  setLoading,
  partnerMode,
  currentUsername,
  setTokenId,
  setPartnerAddress,
  currentPartnerAddress,
  resetState,
  profileImageUrl,
} from '../store/sw-auth.reducer';
import { isCoreTeamMember, joinCommunity } from '../services/web3/web3Service';
import ErrorBox from '../components/ErrorBox';
import { ErrorTypes } from '../types/error-types';

interface Role {
  roleId: number;
  roleName: string;
}

const PartnerUserRole: React.FunctionComponent = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [errorData, setErrorData] = useState(undefined);
  const community = useSelector(currentCommunity);
  const username = useSelector(currentUsername);
  const imageUrl = useSelector(profileImageUrl);
  const partnerAddress = useSelector(currentPartnerAddress);
  const [memberRoles, setMemberRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      await isCoreTeamMember(community.address, window.ethereum.selectedAddress)
        .then((result) => {
          const roles = community?.roles?.roles || [];
          const newUserRolesBaseId = 4;
          const filteredRoles = roles
            .filter((r) => r.isCoreTeamMember === result)
            .map((curr, index) => {
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
            errorMessage: 'Something went wrong',
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

  const handleJoinClicked = async () => {
    dispatch(setLoading(true));
    await joinCommunity(community.address, username, imageUrl, selectedRole, 10)
      .then(async (result) => {
        history.push('/qr');
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
            errorMessage: 'Something went wrong',
            actionLabel: 'Retry',
            action: () => {
              setErrorData(undefined);
              handleJoinClicked();
            },
          });
        }
        dispatch(setLoading(false));
      });
  };

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
        <>
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
