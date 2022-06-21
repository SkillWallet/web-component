import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { community } from '../store/aut.reducer';
import BackButton from '../components/BackButton';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity } from '../services/web3/api';
import { setUserData } from '../store/user-data.reducer';

const UserRole: React.FunctionComponent = (props) => {
  const dipsatch = useAppDispatch();
  const history = useHistory();
  const communityData = useSelector(community);

  //  const onSubmit = async (data: any) => {};

  useEffect(() => {
    const fetchData = async () => {
      dipsatch(fetchCommunity(null));
      console.log('use Effect');
    };
    fetchData();
  }, []);

  const handleRoleSelect = (roleId) => {
    dipsatch(setUserData({ role: roleId }));
  };

  const handleBackClick = async () => {
    history.goBack();
  };

  const goToCommitment = () => {
    history.push('commitment');
  };

  return (
    <Box
      sx={{
        minHeight: '462px',
        width: '100%',
      }}
    >
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
          mb: '9px',
        }}
      >
        {communityData &&
          communityData.roles &&
          communityData.roles.map((role, n) => {
            return (
              <Button onClick={() => handleRoleSelect(role.id)} key={n}>
                {role.roleName}
              </Button>
            );
          })}

        <Button onClick={goToCommitment}>Next: Commitment</Button>
        {/* <SwButton
          sx={{
            borderColor: 'primary.main',
          }}
          btnType="large"
          mode="dark"
          component={Button}
          type="submit"
          disabled={!selectedRole}
          label="That's it - join this community!"
        /> */}
      </Box>
    </Box>
  );
};

export default UserRole;
