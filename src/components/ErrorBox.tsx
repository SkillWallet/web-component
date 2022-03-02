import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SwButton } from 'sw-web-shared';

const ErrorBox = ({ errorData }) => {
  const handleOnClick = () => {
    console.log(errorData);
    if (errorData) {
      errorData.action();
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '460px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ mb: '26px', width: '90%' }} variant="h2">
        {errorData.errorMessage}
      </Typography>
      <SwButton
        sx={{
          borderColor: 'primary.main',
          mb: '26px',
        }}
        onClick={handleOnClick}
        btnType="large"
        mode="dark"
        label={errorData.actionLabel}
      />
    </Box>
  );
};

export default ErrorBox;
