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
