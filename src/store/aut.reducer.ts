import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { fetchCommunity, getAutId, injectMetamask } from '../services/web3/api';
import { OutputEventTypes } from '../types/event-types';
import { dispatchEvent } from '../utils/utils';
import { ActionPayload } from './action-payload';

export interface Community {
  name: string;
  // image: string;
  description: string;
  roles: Role[];
}

export interface Role {
  id: string;
  roleName: string;
}

export enum ResultState {
  'Idle' = 'Idle',
  'Loading' = 'Loading',
  'Updating' = 'Updating',
  'Failed' = 'Failed',
  'Success' = 'Success',
}

export interface AutState {
  community?: Community;
  communityExtensionAddress: string;
  isConnected: boolean;
  showDialog: boolean;
  status: ResultState;
}

export const initialState: AutState = {
  community: null,
  communityExtensionAddress: null,
  isConnected: false,
  showDialog: false,
  status: ResultState.Idle,
};

export interface UserData {
  username: string;
  profileImageUrl: string;
}

export interface UserState {
  username: string;
  profileImageUrl: string;
  isLoggedIn: boolean;
}

export const autSlice = createSlice({
  name: 'aut',
  initialState,
  reducers: {
    setCommunity: (state, action: ActionPayload<any>) => {
      state.community = action.payload;
    },
    setCommunityExtesnionAddress: (state, action: ActionPayload<string>) => {
      state.communityExtensionAddress = action.payload;
    },
    showDialog: (state, action: ActionPayload<boolean>) => {
      state.showDialog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get community
      .addCase(fetchCommunity.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchCommunity.fulfilled, (state, action) => {
        console.log(action.payload);
        state.community = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(fetchCommunity.rejected, (state) => {
        state.status = ResultState.Failed;
      })
      .addCase(getAutId.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(getAutId.fulfilled, (state, action) => {
        state.isConnected = true;
        state.showDialog = false;
        dispatchEvent(OutputEventTypes.Connected, action.payload);
        state.status = ResultState.Idle;
      })
      .addCase(getAutId.rejected, (state) => {
        state.status = ResultState.Failed;
      });
  },
});

export const { setCommunity, setCommunityExtesnionAddress, showDialog } = autSlice.actions;

export const community = createSelector(
  (state) => state.aut.community,
  (community) => community
);

export const autUiState = createSelector(
  (state) => state.aut,
  (aut) => aut
);
// export const currentCommunity = createSelector(
//   (state) => state.swAuth.community as Community & PartnerAgreementKey,
//   (comm: Community & PartnerAgreementKey) => comm
// );

export default autSlice.reducer;
