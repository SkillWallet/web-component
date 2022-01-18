import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { currentCommunity } from '../store/sw-auth.reducer';

export const EventsHandlerWrapper = ({ children }) => {
  const community = useSelector(currentCommunity);
  useEffect(() => {
    window.addEventListener(
      'mayday',
      (e) => {
        console.log(community.name);
      },
      false
    );
  }, []);
  return children;
};

// @Listen('activateSkillwalletCommunity')
// async handlePartnerFlow(event) {
//   console.log(event.detail);
//   this.communityAddress = event.detail.communityAddr;
//   this.partnersAddress = event.detail.partnersAddr;
//   this.partnerKey = event.detail.partnerKey
//   console.log('PK: ', this.partnerKey);
//   const comm = await getCommunity(this.partnerKey);
//   this.community = comm;

//   this.isPartner = true;
//   this.displayLogin = true;
//   this.usersIsVisible = true;
// }
