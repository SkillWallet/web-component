import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface SwAuthState {
  showDialog: boolean;
  mode: string;
}

const initialState: SwAuthState = {
  showDialog: false,
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
  },
});

export const { resetUIState, showDialog } = swAuthSlice.actions;

const show = (state) => state.swAuth.showDialog;
export const isOpen = createSelector(show, (isShown) => isShown);

export default swAuthSlice.reducer;
