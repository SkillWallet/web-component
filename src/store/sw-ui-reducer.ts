import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface SwUIState {
  showDialog: boolean;
  displayButton: boolean;
  disableCreateNewUser: boolean;
  loading: boolean;
  loadingMessage: string;
}
export interface LoadingData {
  loading: boolean;
  loadingMessage?: string;
}

export const initialState: SwUIState = {
  showDialog: false,
  displayButton: true,
  disableCreateNewUser: false,
  loading: false,
  loadingMessage: undefined,
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
    startLoading: (state, action: ActionPayload<string>) => {
      state.loading = true;
      state.loadingMessage = action.payload;
    },
    setLoadingMessage: (state, action: ActionPayload<string>) => {
      state.loadingMessage = action.payload;
    },
    setLoadingData: (state, action: ActionPayload<LoadingData>) => {
      state.loading = action.payload.loading;
      state.loadingMessage = action.payload.loadingMessage;
    },
    loadingFinished: (state, action: ActionPayload<void>) => {
      state.loading = false;
      state.loadingMessage = undefined;
    },
  },
});

export const {
  setDisplayButton,
  showDialog,
  setLoading,
  setDisableCreateNewUser,
  setLoadingMessage,
  setLoadingData,
  loadingFinished,
  startLoading,
} = swUIlice.actions;

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

export const loadingData = createSelector(
  (state) => {
    return {
      loading: state.swUI.loading,
      loadingMessage: state.swUI.loadingMessage,
    };
  },
  (isLoading) => isLoading
);

export default swUIlice.reducer;
