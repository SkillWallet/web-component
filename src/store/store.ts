import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { combineReducers } from 'redux';
import swAuthSliceReducer from './sw-auth.reducer';
import swUserDataReducer from './sw-user-data.reducer';

const reducers = combineReducers({
  swAuth: swAuthSliceReducer,
  userData: swUserDataReducer,
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: reducers,
});

export default store;
