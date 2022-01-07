import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface SwAuthState {
  showDialog: boolean;
  partnerKey?: string;
  loading: boolean;
  mode: string;
}

const initialState: SwAuthState = {
  showDialog: false,
  partnerKey: undefined,
  loading: false,
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
  },
});

export const { resetUIState, showDialog, setPartnerKey, setLoading } = swAuthSlice.actions;

const show = (state) => state.swAuth.showDialog;
export const isOpen = createSelector(show, (isShown) => isShown);
const key = (state) => state.swAuth.partnerKey;
export const currentPartnerKey = createSelector(key, (currentKey) => currentKey);
const loading = (state) => state.swAuth.loading;
export const loadingInProgress = createSelector(loading, (isLoading) => isLoading);

export default swAuthSlice.reducer;
