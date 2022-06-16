import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { getCommunity } from '../services/web3/web3Service';

export const EventsHandlerWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  return children;
};
