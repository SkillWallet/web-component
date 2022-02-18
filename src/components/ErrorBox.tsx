import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SwButton } from 'sw-web-shared';

const ErrorBox = ({ errorMessage, action, actionLabel }) => {
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
      <Typography sx={{ mb: '26px' }} variant="h2">
        {errorMessage}
      </Typography>
      <SwButton
        sx={{
          borderColor: 'primary.main',
          mb: '26px',
        }}
        onClick={action}
        btnType="large"
        mode="dark"
        label={actionLabel}
      />
    </Box>
  );
};

export default ErrorBox;
