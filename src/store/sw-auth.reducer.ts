import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface SwAuthState {
  showDialog: boolean;
  partnerKey?: string;
  loading: boolean;
  // Add type
  community: any;
  mode: string;
}

const initialState: SwAuthState = {
  showDialog: false,
  partnerKey: undefined,
  loading: false,
  community: undefined,
  mode: 'light',
};

export const swAuthSlice = createSlice({
  name: 'swAuth',
  initialState,
  reducers: {
    resetUIState: () => initialState,
    showDialog: (state, action: ActionPayload<boolean>) => {
      state.showDialog = action.payload;
    },
    setPartnerKey: (state, action: ActionPayload<string>) => {
      state.partnerKey = action.payload;
    },
    setLoading: (state, action: ActionPayload<boolean>) => {
      state.loading = action.payload;
    },
    setCommunity: (state, action: ActionPayload<any>) => {
      state.community = action.payload;
    },
  },
});

export const { resetUIState, showDialog, setPartnerKey, setLoading, setCommunity } = swAuthSlice.actions;

const show = (state) => state.swAuth.showDialog;
export const isOpen = createSelector(show, (isShown) => isShown);
const key = (state) => state.swAuth.partnerKey;
export const currentPartnerKey = createSelector(key, (currentKey) => currentKey);
const loading = (state) => state.swAuth.loading;
export const loadingInProgress = createSelector(loading, (isLoading) => isLoading);
const community = (state) => state.swAuth.community;
export const currentCommunity = createSelector(community, (comm) => comm);

export default swAuthSlice.reducer;
