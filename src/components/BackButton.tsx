import { ArrowBackIos } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SwButton } from 'sw-web-shared';

const BackButton = (props) => {
  const handleOnClick = () => {
    props.handleClick();
  };
  return (
    <IconButton
      onClick={handleOnClick}
      sx={{
        ...props.sx,
        borderRadius: '30px',
        '&:hover': {
          background: '#FFFFFF',
          '& .backIcon': {
            color: '#000000',
          },
        },
        width: '45px',
        height: '45px',
      }}
      {...props}
    >
      <ArrowBackIos
        color="secondary"
        className="backIcon"
        sx={{
          pl: '8px',
        }}
      />
    </IconButton>
  );
};

export default BackButton;
