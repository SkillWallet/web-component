import IRoute from '../interfaces/route';
import LoginWith from '../pages/LoginWith';
import LoginWithSkillWallet from '../pages/LoginWithSkillWallet';
import NewUser from '../pages/NewUser';
import UserDetails from '../pages/UserDetails';

const routes: IRoute[] = [
  {
    path: '/',
    name: 'Login With',
    component: LoginWith,
    exact: true,
  },
  {
    path: '/skillwallet',
    name: 'Skill Wallet',
    component: LoginWithSkillWallet,
    exact: true,
  },
  {
    path: '/newuser',
    name: 'New User',
    component: NewUser,
    exact: true,
  },
  {
    path: '/userdetails',
    name: 'User Details',
    component: UserDetails,
    exact: true,
  },
  {
    path: '/newuser',
    name: 'New User',
    component: NewUser,
    exact: true,
  },
];

export default routes;
