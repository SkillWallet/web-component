import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { combineReducers } from 'redux';
import swAuthSliceReducer from './sw-auth.reducer';

const reducers = combineReducers({
  swAuth: swAuthSliceReducer,
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: reducers,
});

export default store;
