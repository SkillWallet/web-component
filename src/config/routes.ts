import IRoute from '../interfaces/route';
import LoginWith from '../pages/LoginWith';
import LoginWithSkillWallet from '../pages/LoginWithSkillWallet';
import NewUser from '../pages/NewUser';
import PartnerUserRole from '../pages/PartnerUserRole';
import ScanQR from '../pages/ScanQR';
import UserDetails from '../pages/UserDetails';
import UserRole from '../pages/UserRole';

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
    path: '/role',
    name: 'User Role',
    component: UserRole,
    exact: true,
  },
  {
    path: '/partnerRole',
    name: 'Partner Role',
    component: PartnerUserRole,
    exact: true,
  },
  {
    path: '/qr',
    name: 'Scan QR',
    component: ScanQR,
    exact: true,
  },
];

export default routes;
