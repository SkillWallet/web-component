import { Box, Dialog, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import routes from '../config/routes';
import { loadingData } from '../store/sw-ui-reducer';

function MainDialog({ container, open, handleClose }) {
  const loadingState = useSelector(loadingData);
  return (
    <>
      <Dialog maxWidth="xs" fullWidth container={container} open={open} onClose={handleClose}>
        <Box
          sx={{
            width: '99%',
            minHeight: '460px',
            minWidth: '480px',
            display: loadingState.loading ? 'flex' : 'none',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {loadingState.loadingMessage && (
            <Typography align="center" sx={{ mb: '26px', width: '90%' }} variant="h2">
              {loadingState.loadingMessage}
            </Typography>
          )}
          <CircularProgress color="secondary" />
        </Box>
        <Box sx={{ display: !loadingState.loading ? 'flex' : 'none', alignContent: 'center', justifyContent: 'center' }}>
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
