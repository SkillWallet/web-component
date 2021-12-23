import IRoute from '../interfaces/route';
import LoginWith from '../pages/LoginWith';
import SecondPage from '../pages/SecondPage';

const routes: IRoute[] = [
  {
    path: '/',
    name: 'Login With',
    component: LoginWith,
    exact: true,
  },
  {
    path: '/second',
    name: 'Second',
    component: SecondPage,
    exact: true,
  },
];

export default routes;
