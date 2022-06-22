import { Box } from '@mui/system';
import { ReactComponent as Logo } from '../assets/d-aut-logo.svg';

const AutLogo = (props) => {
  return (
    <Box {...props} sx={{ width: '110px', height: '60px' }}>
      <Logo />
    </Box>
  );
};

export default AutLogo;
