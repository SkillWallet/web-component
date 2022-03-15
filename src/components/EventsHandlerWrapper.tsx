import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCommunity } from '../services/web3/web3Service';
import { setCommunity, setPartnerKey, setPartnerMode } from '../store/sw-auth.reducer';
import { showDialog } from '../store/sw-ui-reducer';

export const EventsHandlerWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener(
      'mayday',
      (e) => {
        console.log('LOUD AND CLEAR');
      },
      false
    );
    window.addEventListener(
      'activateSkillwalletCommunity',
      async (e) => {
        console.log(e);
        const { communityAddr, partnersAddr, partnerKey } = (e as any).detail;
        // dispatch(setCommunityAddress(communityAddr));
        // dispatch(setPartnerAddress(partnersAddr));
        dispatch(setPartnerKey(partnerKey));
        console.log('PK: ', partnerKey);
        // maybe redundant
        const comm = await getCommunity(partnerKey);
        console.log('Community', comm);
        dispatch(setCommunity(comm));
        dispatch(setPartnerMode(true));
        dispatch(showDialog(true));
      },
      false
    );

    return function cleanup() {
      console.log('memory leak');
    };
  }, [dispatch]);

  return children;
};
