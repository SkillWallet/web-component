import { Label } from '@mui/icons-material';
import { Input, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { SwButton } from 'sw-web-shared';

const ErrorBox = ({ errorMessage, action }) => {
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
      <Typography variant="h2">{errorMessage}</Typography>
      <SwButton
        sx={{
          borderColor: 'primary.main',
        }}
        onClick={action}
        btnType="large"
        mode="dark"
        label="Go Back"
      />
    </Box>
  );
};

export default ErrorBox;
