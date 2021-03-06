import { Box, Dialog, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import routes from '../config/routes';
import { uiData } from '../store/sw-ui-reducer';

function MainDialog({ container, open, handleClose }) {
  const uiState = useSelector(uiData);
  return (
    <>
      <Dialog maxWidth="xs" fullWidth container={container} open={open} onClose={handleClose}>
        <Box
          sx={{
            width: '99%',
            minHeight: '460px',
            minWidth: '480px',
            display: uiState.showGlobalError ? 'flex' : 'none',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography align="center" sx={{ mb: '26px', width: '90%' }} variant="h2">
            {uiState.globalErrorMessage}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '99%',
            minHeight: '460px',
            minWidth: '480px',
            display: uiState.loading || uiState.validatingDomain ? 'flex' : 'none',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {(uiState.loadingMessage || uiState.validatingDomain) && (
            <Typography align="center" sx={{ mb: '26px', width: '90%' }} variant="h2">
              {uiState.validatingDomain ? 'Validating domain name.' : uiState.loadingMessage}
            </Typography>
          )}
          <CircularProgress color="secondary" />
        </Box>
        <Box
          sx={{
            display: !uiState.loading && !uiState.showGlobalError && !uiState.validatingDomain ? 'flex' : 'none',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Switch>
            {routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  render={(props: RouteComponentProps<any>) => <route.component {...props} {...route.props} />}
                />
              );
            })}
          </Switch>
        </Box>
      </Dialog>
    </>
  );
}

export default MainDialog;
