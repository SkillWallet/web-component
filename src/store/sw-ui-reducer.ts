import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface SwUIState {
  showDialog: boolean;
  displayButton: boolean;
  disableCreateNewUser: boolean;
  loading: boolean;
}

const initialState: SwUIState = {
  showDialog: false,
  displayButton: true,
  disableCreateNewUser: false,
  loading: false,
};

export const swUIlice = createSlice({
  name: 'swUI',
  initialState,
  reducers: {
    showDialog: (state, action: ActionPayload<boolean>) => {
      state.showDialog = action.payload;
    },
    setDisableCreateNewUser: (state, action: ActionPayload<boolean>) => {
      state.disableCreateNewUser = action.payload;
    },
    setDisplayButton: (state, action: ActionPayload<boolean>) => {
      state.displayButton = action.payload;
    },
    setLoading: (state, action: ActionPayload<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setDisplayButton, showDialog, setLoading, setDisableCreateNewUser } = swUIlice.actions;

export const isOpen = createSelector(
  (state) => state.swUI.showDialog,
  (isShown) => isShown
);
export const showButton = createSelector(
  (state) => state.swUI.displayButton,
  (display) => display
);
export const loadingInProgress = createSelector(
  (state) => state.swUI.loading,
  (isLoading) => isLoading
);

export default swUIlice.reducer;
