import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { combineReducers } from 'redux';
import swAuthSliceReducer, { initialState as initAuthState } from './sw-auth.reducer';
import swUserDataReducer, { initialState as initUserDataState } from './sw-user-data.reducer';
import swUIReducer, { initialState as initUIState } from './sw-ui-reducer';

const appReducer = combineReducers({
  swAuth: swAuthSliceReducer,
  swUserData: swUserDataReducer,
  swUI: swUIReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_UI') {
    console.log(state);
    state = {
      swAuth: {
        ...initAuthState,
        partnerKey: state.swAuth.partnerKey,
        partnerAddress: state.swAuth.partnerAddress,
      },
      swUserData: { ...initUserDataState },
      swUI: {
        ...initUIState,
        showDialog: state.swUI.showDialog,
        validatingDomain: state.swUI.validatingDomain,
        globalErrorMessage: state.swUI.globalErrorMessage,
        showGlobalError: state.swUI.showGlobalError,
        disableCreateNewUser: state.swUI.disableCreateNewUser,
      },
    };
  }
  return appReducer(state, action);
};

export const resetUIState = { type: 'RESET_UI' };

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: rootReducer,
});

export default store;
