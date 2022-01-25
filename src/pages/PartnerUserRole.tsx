import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { currentCommunity, setLoading, partnerMode, currentUsername, setTokenId } from '../store/sw-auth.reducer';
import { joinCommunity } from '../services/web3/web3Service';

interface Role {
  roleId: number;
  roleName: string;
}

const partnerRoles = [
  {
    roleName: 'Founder',
    roleId: 1,
  },
  {
    roleName: 'Contributor',
    roleId: 2,
  },
  {
    roleName: 'Investor',
    roleId: 3,
  },
];

const PartnerUserRole: React.FunctionComponent = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);
  const username = useSelector(currentUsername);
  const [selectedRole, setSelectedRole] = useState(undefined);

  const handleJoinClicked = async () => {
    dispatch(setLoading(true));
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenId = await joinCommunity(web3Provider, community.address, username, selectedRole, 10);
    // IMPORTANT
    // const active = await activatePA(this.partnersAddress);
    console.log(tokenId);
    dispatch(setTokenId(tokenId));
    history.push('/qr');
    dispatch(setLoading(false));
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
          {partnerRoles &&
            partnerRoles.map((role: Role, index) => {
              return (
                <SwButton
                  key={index}
                  sx={{
                    maxWidth: '212px',
                    maxHeight: '44px',
                  }}
                  mode="dark"
                  btnType="large"
                  label={role.roleName}
                  onClick={() => handleRoleSelected(role)}
                />
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
    </Box>
  );
};

export default PartnerUserRole;
