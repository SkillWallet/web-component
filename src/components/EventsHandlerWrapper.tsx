import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { getCommunity } from '../services/web3/web3Service';
import { setCommunity, setPartnerKey, setPartnerMode } from '../store/sw-auth.reducer';
import { showDialog } from '../store/sw-ui-reducer';
import { OutputEventTypes, InputEventTypes } from '../types/event-types';
import { dispatchSwEvent } from '../utils/utils';

export const EventsHandlerWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  return children;
};
