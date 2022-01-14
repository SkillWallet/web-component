import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Button, Input, Slider, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import IPage from '../interfaces/page';
import { currentCommunity, setLoading } from '../store/sw-auth.reducer';
import { isCoreTeamMember, joinCommunity } from '../services/web3/web3Service';
import RemainingCharsTextInput from '../components/RemainingCharsTextInput';
import { pushImage } from '../services/textile/textile.hub';
import { setUserName, setUserProfilePicture, currentUsername, setTokenId } from '../store/sw-user-data.reducer';
import { CustomSlider } from '../components/CustomSlider';

const rolesIds = {
  Founder: 1,
  Contributor: 2,
  Investor: 3,
};

interface Role {
  roleId: number;
  roleName: string;
}

const defaultValues = {
  commitment: 0,
};

const UserRole: React.FunctionComponent<IPage> = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const community = useSelector(currentCommunity);
  const username = useSelector(currentUsername);
  const [memberRoles, setMemberRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(undefined);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({ defaultValues });

  const onSubmit = async (data: any) => {
    // this.isLoadingEvent.emit(true);
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenId = await joinCommunity(
      web3Provider,
      community.address,
      window.sessionStorage.getItem('username'),
      selectedRole,
      data.commitment
    );
    console.log(tokenId);
    await dispatch(setTokenId(tokenId));
    history.push('/qr');
    // this.isLoadingEvent.emit(false);
    // window.sessionStorage.setItem('tokenId', tokenId);
    // this.showNewScreen.emit('role');
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(selectedRole);
      const isCoreMember = await isCoreTeamMember(community.partnersAgreementAddress, window.ethereum.selectedAddress);
      const roles = community?.roles?.roles || [];
      console.log(roles);
      const newUserRolesBaseId = 4;
      console.log('isCoreMember: -----', isCoreMember);
      const filteredRoles = roles
        .filter((r) => r.isCoreTeamMember === isCoreMember)
        .map((curr, index) => {
          console.log(curr);
          const { roleName } = curr;
          let roleId;
          if (roleId <= 3) {
            roleId = curr.roleId;
          } else {
            roleId = newUserRolesBaseId + index;
          }
          console.log({ roleId, roleName });
          return { roleId, roleName };
        });
      console.log(filteredRoles);
      setMemberRoles(filteredRoles);
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
              minWidth: '383px',
              border: 2,
              borderColor: 'secondary',
              backgroundColor: '#FFFFFF',
            }}
          >
            {selectedRole ? (
              <Box
                sx={{
                  mb: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '212px',
                  border: 2,
                  borderColor: '#000000',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Typography align="center" sx={{ width: '100%', color: 'secondary', backgroundColor: '#000000' }} variant="h2">
                  {(selectedRole as Role).roleName}
                </Typography>
                <Typography align="center" variant="h4" sx={{ color: '#000000', fontWeight: '400', maxWidth: '320px', mb: '15px' }}>
                  Your{' '}
                  <Typography variant="h4" component="span" sx={{ color: '#000000', fontWeight: '600', textDecorationLine: 'underline' }}>
                    Commitment Level
                  </Typography>
                </Typography>
                <Typography align="center" variant="h5" sx={{ color: '#000000', fontWeight: '400', maxWidth: '320px' }}>
                  Tell your community how much time you commit to this Role!
                </Typography>
                <CustomSlider
                  name="commitment"
                  control={control}
                  setValue={setValue}
                  //   rules={{
                  //     validate: () => {
                  //       console.log(getValues('commitment'));
                  //       return getValues('commitment') > 0 && getValues('commitment') < 11;
                  //     },
                  //   }}
                  rules={{ min: 1, max: 10 }}
                />
                {/* <Slider
                sx={{ maxWidth: '166px', border: 2, borderRadius: 0, borderColor: '#000000', p: '10px' }}
                defaultValue={0}
                step={1}
                min={0}
                max={10}
              /> */}
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
                    mode="dark"
                    btnType="large"
                    label={role.roleName}
                    onClick={() => handleRoleSelected(role)}
                  />
                );
              })
            )}
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
            type="submit"
            disabled={!isValid}
            label="That's it - join this community!"
          />
        </Box>
      </form>
    </Box>
  );
};

export default UserRole;
