import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Interface } from 'ethers/lib/utils';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface Community {
  name?: string;
  address?: string;
}
export interface SwAuthState {
  // SLICE
  // showDialog: boolean;
  // displayButton: boolean;
  // SLICE
  partnerKey?: string;
  // SLICE
  // disableCreateNewUser: boolean;
  // SLICE
  partnerAddress?: string;
  communityAddress?: string;
  partnerMode?: boolean;
  // SLICE
  // loading: boolean;
  // SLICE
  // Add type
  community?: any;
  mode: string;
}

const initialState: SwAuthState = {
  // showDialog: false,
  // displayButton: true,
  partnerKey: undefined,
  // disableCreateNewUser: false,
  partnerAddress: undefined,
  communityAddress: undefined,
  partnerMode: false,
  // loading: false,
  community: undefined,
  mode: 'light',
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

export const swAuthSlice = createSlice({
  name: 'swAuth',
  initialState,
  reducers: {
    resetUIState: () => initialState,
    // showDialog: (state, action: ActionPayload<boolean>) => {
    //   state.showDialog = action.payload;
    // },
    setPartnerKey: (state, action: ActionPayload<string>) => {
      state.partnerKey = action.payload;
    },
    // setDisableCreateNewUser: (state, action: ActionPayload<boolean>) => {
    //   state.disableCreateNewUser = action.payload;
    // },
    // setDisplayButton: (state, action: ActionPayload<boolean>) => {
    //   state.displayButton = action.payload;
    // },
    setPartnerAddress: (state, action: ActionPayload<string>) => {
      state.partnerAddress = action.payload;
    },
    // setLoading: (state, action: ActionPayload<boolean>) => {
    //   state.loading = action.payload;
    // },
    setCommunity: (state, action: ActionPayload<any>) => {
      state.community = action.payload;
    },
    setPartnerMode: (state, action: ActionPayload<boolean>) => {
      state.partnerMode = action.payload;
    },
    // SLICE
    resetState(state, action: ActionPayload<void>) {
      state = {
        ...initialState,
        partnerKey: state.partnerKey,
        partnerMode: state.partnerMode,
        partnerAddress: state.partnerAddress,
        // disableCreateNewUser: state.disableCreateNewUser,
      };
    },
  },
});

export const {
  resetState,
  // setDisplayButton,
  resetUIState,
  // showDialog,
  setPartnerKey,
  // setLoading,
  setCommunity,
  setPartnerMode,
  // setDisableCreateNewUser,
} = swAuthSlice.actions;

export const currentPartnerKey = createSelector(
  (state) => state.swAuth.partnerKey,
  (currentKey) => currentKey
);
export const currentCommunity = createSelector(
  (state) => state.swAuth.community,
  (comm) => comm
);
export const partnerMode = createSelector(
  (state) => state.swAuth.partnerMode,
  (isPartner) => isPartner
);
export const swData = createSelector(
  (state) => {
    return {
      community: state.swAuth.community,
      partnerMode: state.swAuth.partnerMode,
      partnerKey: state.swAuth.partnerKey,
      disableCreateNewUser: state.swUI.disableCreateNewUser,
    };
  },
  (data) => data
);

export default swAuthSlice.reducer;
