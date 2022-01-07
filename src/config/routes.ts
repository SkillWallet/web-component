import IRoute from '../interfaces/route';
import LoginWith from '../pages/LoginWith';
import LoginWithSkillWallet from '../pages/LoginWithSkillWallet';

const routes: IRoute[] = [
  {
    path: '/',
    name: 'Login With',
    component: LoginWith,
    exact: true,
  },
  {
    path: '/skillwallet',
    name: 'SkillWallet',
    component: LoginWithSkillWallet,
    exact: true,
  },
];

export default routes;
