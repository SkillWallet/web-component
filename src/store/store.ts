import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { combineReducers } from 'redux';
import swAuthSliceReducer from './sw-auth.reducer';
import swUserDataReducer from './sw-user-data.reducer';
import swUIReducer from './sw-ui-reducer';

const appReducer = combineReducers({
  swAuth: swAuthSliceReducer,
  swUserData: swUserDataReducer,
  swUI: swUIReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    console.log(state);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: rootReducer,
});

export default store;
