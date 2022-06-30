import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactComponent as Oval } from '../assets/oval.svg';
import { ReactComponent as DarkOval } from '../assets/darker-oval.svg';
import { pxToRem } from '../services/web3/utils';

export const RoundedButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    height: '60px',
    width: '232px',
    background:
      'transparent linear-gradient(270deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 0% 0%',
    border: `${pxToRem(3)} solid #009FE3`,
    overflow: 'hidden',
    borderRadius: '50px',
    // textDecoration: 'uppercase',
    // color: 'white',
    // textTransform: 'none',
    // letterSpacing: '3px',
    // fontSize: pxToRem(14),
    // '&.Mui-disabled': {
    //   color: 'white',
    //   opacity: '.3',
    // },
    // '&:hover': {
    //   backgroundColor: '#009ADE',
    //   color: 'white',
    // },
  },
}));

export const RoundedWebButton = () => {
  return (
    <RoundedButton
      sx={{
        '&:hover': {
          backgroundColor: '#009ADE',
          color: 'white',
        },
      }}
    >
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: '101',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
            Connect with aut
          </Typography>
        </Box>
        <Box sx={{ zIndex: '100', position: 'absolute' }}>
          <Box sx={{ transform: 'translate(150px, -12px)' }}>
            <Oval />
          </Box>
          <Box sx={{ transform: 'translateX(97px)' }}>
            <DarkOval />
          </Box>
        </Box>
      </Box>
    </RoundedButton>
  );
};
