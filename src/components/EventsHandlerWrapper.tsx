import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCommunity } from '../services/web3/web3Service';
import { setCommunity, setPartnerKey, setPartnerMode } from '../store/sw-auth.reducer';
import { showDialog } from '../store/sw-ui-reducer';

export const EventsHandlerWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const onActivateCommunity = async ({ detail }: any) => {
      const { communityAddr, partnersAddr, partnerKey } = detail;
      dispatch(setPartnerKey(partnerKey));
      try {
        const comm = await getCommunity(partnerKey);
        const event = new CustomEvent('activateSkillWalletCommunitySuccess', {
          composed: true,
          cancelable: true,
          bubbles: true,
          detail: 'Successfully initiated SkillWallet authentiaciton.',
        });
        console.log('Sending event.');
        window.dispatchEvent(event);
        console.log('Community', comm);
        dispatch(setCommunity(comm));
        dispatch(setPartnerMode(true));
        dispatch(showDialog(true));
      } catch (error) {
        console.log(error);
        const event = new CustomEvent('activateSkillWalletCommunityError', {
          composed: true,
          cancelable: true,
          bubbles: true,
          detail: 'Filed to retrieve community',
        });
        console.log('Sending event.');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('activateSkillwalletCommunity', onActivateCommunity, false);

    return () => {
      window.removeEventListener('activateSkillwalletCommunity', onActivateCommunity);
    };
  }, [dispatch]);

  return children;
};
