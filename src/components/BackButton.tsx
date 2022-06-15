import { ArrowBackIos } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SwButton } from 'sw-web-shared';

const BackButton = ({ handleClick }) => {
  const handleOnClick = () => {
    handleClick();
  };
  return (
    <IconButton
      onClick={handleOnClick}
      sx={{
        borderRadius: '30px',
        '&:hover': {
          background: '#000',
          '& .backIcon': {
            color: '#FFF',
          },
        },
        width: '45px',
        height: '45px',
      }}
    >
      <ArrowBackIos
        color="primary"
        className="backIcon"
        sx={{
          pl: '8px',
        }}
      />
    </IconButton>
  );
};

export default BackButton;
