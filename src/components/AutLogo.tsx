import { Box } from '@mui/system';
import { ReactComponent as Logo } from '../assets/d-aut-logo.svg';

const AutLogo = (props) => {
  return (
    <Box {...props} sx={{ width: '120px', height: '70px' }}>
      <Logo />
    </Box>
  );
};

export default AutLogo;
