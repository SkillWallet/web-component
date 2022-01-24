import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCommunity } from '../services/web3/web3Service';
import { setCommunity, setPartnerKey, setCommunityAddress, setPartnerAddress, setPartnerMode } from '../store/sw-auth.reducer';

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
        const { communityAddress, partnersaddress, partnerKey } = (e as any).detail;
        dispatch(setCommunityAddress(communityAddress));
        dispatch(setPartnerAddress(partnersaddress));
        dispatch(setPartnerKey(partnerKey));
        console.log('PK: ', partnerKey);
        // maybe redundant
        const comm = await getCommunity(partnerKey);
        dispatch(setCommunity(comm));
        dispatch(setPartnerMode(true));
      },
      false
    );
  }, [dispatch]);

  return children;
};
