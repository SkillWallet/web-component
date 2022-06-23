import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { pxToRem } from '../services/web3/utils';
import { ReactComponent as Metamask } from '../assets/metamask.svg';

export const AutButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    height: '60px',
    width: '275px',
    border: `${pxToRem(3)} solid #009FE3`,
    borderRadius: '50px',
    textDecoration: 'uppercase',
    color: 'white',
    textTransform: 'none',
    letterSpacing: '3px',
    fontSize: pxToRem(14),
    '&.Mui-disabled': {
      color: 'white',
      opacity: '.3',
    },
    '&:hover': {
      backgroundColor: '#009ADE',
      color: 'white',
    },
  },
}));

export const ButtonIcon = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
}));
