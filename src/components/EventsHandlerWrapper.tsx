import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getCommunity } from '../services/web3/web3Service';
import { setCommunity, setPartnerKey, setPartnerMode } from '../store/sw-auth.reducer';
import { showDialog } from '../store/sw-ui-reducer';
import { OutputEventTypes, InputEventTypes } from '../types/event-types';
import { dispatchSwEvent } from '../utils/utils';

export const EventsHandlerWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    const onActivateCommunity = async ({ detail }: any) => {
      const { communityAddr, partnersAddr, partnerKey } = detail;
      dispatch(setPartnerKey(partnerKey));
      try {
        const comm = await getCommunity(partnerKey);
        history.push('/');
        dispatchSwEvent(OutputEventTypes.ActivateSuccess, 'Successfully initiated SkillWallet authentiaciton.');
        console.log('Sending event.');
        dispatch(setCommunity(comm));
        dispatch(setPartnerMode(true));
        dispatch(showDialog(true));
      } catch (error) {
        console.log(error);
        dispatchSwEvent(OutputEventTypes.ActivateError, 'Filed to retrieve community');
      }
    };

    window.addEventListener(InputEventTypes.Activate, onActivateCommunity, false);

    return () => {
      window.removeEventListener(InputEventTypes.Activate, onActivateCommunity);
    };
  }, [dispatch]);

  return children;
};
