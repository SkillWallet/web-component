import { Box, Card, CardContent, CardHeader, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

function Introduction() {
  return (
    <>
      <Box>
        <Card
          sx={{
            mb: '20px',
            border: '1px solid',
            borderColor: 'primary.main',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.dark',
          }}
        >
          <CardHeader
            title="HEADER"
            titleTypographyProps={{
              mx: 'auto',
              variant: 'h2',
              align: 'center',
              color: 'primary.main',
              mt: '6px',
            }}
          />
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'center',
              p: '5px',
            }}
          >
            <Typography variant="h3">SAS</Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default Introduction;
