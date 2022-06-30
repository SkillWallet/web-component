import { Box, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { errorAction, errorState } from '../store/aut.reducer';
import AutLogo from './AutLogo';
import { AutButton } from './AutButton';

export const ErrorBox = () => {
  const errorMessage = useSelector(errorState);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleError = () => {
    dispatch(errorAction(null));
    history.push('/');
  };
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mt: '16px' }}>
        <AutLogo />
      </Box>
      <Typography sx={{ color: '#B10000', mt: '25px' }} variant="h1">
        {errorMessage}
      </Typography>
      <AutButton sx={{ mt: '40px' }} onClick={handleError}>
        Return
      </AutButton>
    </Box>
  );
};
