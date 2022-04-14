import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Community, PartnerAgreementKey } from '../services/web3/models';
import { ActionPayload } from './action-payload';

export interface SwAuthState {
  partnerKey?: string;
  partnerAddress?: string;
  communityAddress?: string;
  partnerMode?: boolean;
  community: Community & PartnerAgreementKey;
  mode: string;
}

export const initialState: SwAuthState = {
  partnerKey: undefined,
  partnerAddress: undefined,
  communityAddress: undefined,
  partnerMode: false,
  community: new Community() as Community & PartnerAgreementKey,
  mode: 'light',
};

export interface UserData {
  username: string;
  profileImageUrl: string;
}

export interface UserState {
  username: string;
  profileImageUrl: string;
  isLoggedIn: boolean;
}

export const swAuthSlice = createSlice({
  name: 'swAuth',
  initialState,
  reducers: {
    setPartnerKey: (state, action: ActionPayload<string>) => {
      state.partnerKey = action.payload;
    },
    setPartnerAddress: (state, action: ActionPayload<string>) => {
      state.partnerAddress = action.payload;
    },
    setCommunity: (state, action: ActionPayload<any>) => {
      state.community = action.payload;
    },
    setPartnerMode: (state, action: ActionPayload<boolean>) => {
      state.partnerMode = action.payload;
    },
  },
});

export const { setPartnerKey, setCommunity, setPartnerMode } = swAuthSlice.actions;

export const currentPartnerKey = createSelector(
  (state) => state.swAuth.partnerKey,
  (currentKey) => currentKey
);
export const currentCommunity = createSelector(
  (state) => state.swAuth.community as Community & PartnerAgreementKey,
  (comm: Community & PartnerAgreementKey) => comm
);
export const partnerMode = createSelector(
  (state) => state.swAuth.partnerMode,
  (isPartner) => isPartner
);
export const swData = createSelector(
  (state) => {
    return {
      community: state.swAuth.community,
      partnerMode: state.swAuth.partnerMode,
      partnerKey: state.swAuth.partnerKey,
      disableCreateNewUser: state.swUI.disableCreateNewUser,
    };
  },
  (data) => data
);

export default swAuthSlice.reducer;
