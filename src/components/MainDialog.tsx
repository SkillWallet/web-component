import { Box, Dialog } from '@mui/material';
import { useSelector } from 'react-redux';

import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import routes from '../config/routes';
import { loadingInProgress } from '../store/sw-auth.reducer';

function MainDialog({ container, open, handleClose }) {
  const loading = useSelector(loadingInProgress);
  return (
    <>
      <Dialog maxWidth="xs" fullWidth container={container} open={open} onClose={handleClose}>
        <Box
          sx={{
            width: '99%',
            minHeight: '460px',
            minWidth: '480px',
            display: loading ? 'flex' : 'none',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
        <Box sx={{ display: !loading ? 'flex' : 'none', alignContent: 'center', justifyContent: 'center' }}>
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
