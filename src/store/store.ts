import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { combineReducers } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import swAuthSliceReducer from './sw-auth.reducer';

const persistConfig: PersistConfig<any> = {
  key: 'sw-auth',
  storage,
  stateReconciler: autoMergeLevel2,
};

const reducers = combineReducers({
  swAuth: swAuthSliceReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: persistedReducer,
});

export default store;
