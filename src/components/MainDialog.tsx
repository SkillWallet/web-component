import { Dialog } from '@mui/material';

import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import routes from '../config/routes';

function MainDialog({ container, open, handleClose }) {
  return (
    <>
      <Dialog maxWidth="xs" fullWidth container={container} open={open} onClose={handleClose}>
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
      </Dialog>
    </>
  );
}

export default MainDialog;
