import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { pxToRem } from '../services/web3/utils';

export const AutButton = styled<ButtonProps<any, any>>(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    height: '55px',
    width: '300px',
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
