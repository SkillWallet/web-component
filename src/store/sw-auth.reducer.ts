import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Interface } from 'ethers/lib/utils';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface Community {
  name?: string;
  address?: string;
}
export interface SwAuthState {
  showDialog: boolean;
  displayButton: boolean;
  partnerKey?: string;
  partnerAddress?: string;
  communityAddress?: string;
  partnerMode?: boolean;
  loading: boolean;
  // Add type
  community?: any;
  skillWallet?: any;
  mode: string;
  // SLICE
  username?: string;
  profileImageUrl?: string;
  isLoggedIn: boolean;
  tokenId?: string;
}

const initialState: SwAuthState = {
  showDialog: false,
  displayButton: true,
  partnerKey: undefined,
  partnerAddress: undefined,
  communityAddress: undefined,
  partnerMode: false,
  loading: false,
  community: undefined,
  skillWallet: undefined,
  mode: 'light',
  // SLICE
  username: undefined,
  profileImageUrl: undefined,
  isLoggedIn: false,
  tokenId: undefined,
};

export const swAuthSlice = createSlice({
  name: 'swAuth',
  initialState,
  reducers: {
    resetUIState: () => initialState,
    showDialog: (state, action: ActionPayload<boolean>) => {
      state.showDialog = action.payload;
    },
    setPartnerKey: (state, action: ActionPayload<string>) => {
      state.partnerKey = action.payload;
    },
    setDisplayButton: (state, action: ActionPayload<boolean>) => {
      state.displayButton = action.payload;
    },
    setPartnerAddress: (state, action: ActionPayload<string>) => {
      state.partnerAddress = action.payload;
    },
    setLoading: (state, action: ActionPayload<boolean>) => {
      state.loading = action.payload;
    },
    setCommunity: (state, action: ActionPayload<any>) => {
      state.community = action.payload;
    },
    // SUS
    setCommunityAddress: (state, action: ActionPayload<string>) => {
      state.communityAddress = action.payload;
    },
    setPartnerMode: (state, action: ActionPayload<boolean>) => {
      state.partnerMode = action.payload;
    },
    setSkillWallet: (state, action: ActionPayload<any>) => {
      state.skillWallet = action.payload;
    },
    // SLICE
    setUserProfilePicture(state, action: ActionPayload<string>) {
      state.profileImageUrl = action.payload;
    },
    setUserName(state, action: ActionPayload<string>) {
      state.username = action.payload;
    },
    setTokenId(state, action: ActionPayload<string>) {
      state.tokenId = action.payload;
    },
    setLoggedIn(state, action: ActionPayload<boolean>) {
      state.isLoggedIn = action.payload;
    },
    resetState(state, action: ActionPayload<void>) {
      state = {
        ...initialState,
        partnerKey: state.partnerKey,
        partnerMode: state.partnerMode,
        partnerAddress: state.partnerAddress,
      };
    },
  },
});

export const {
  resetState,
  setDisplayButton,
  resetUIState,
  setSkillWallet,
  showDialog,
  setPartnerKey,
  setLoading,
  setCommunity,
  setPartnerMode,
  setCommunityAddress,
  setPartnerAddress,
  // SLICE
  setUserProfilePicture,
  setUserName,
  setTokenId,
  setLoggedIn,
} = swAuthSlice.actions;

const show = (state) => state.swAuth.showDialog;
export const isOpen = createSelector(show, (isShown) => isShown);
const displayButton = (state) => state.swAuth.displayButton;
export const showButton = createSelector(displayButton, (display) => display);
const key = (state) => state.swAuth.partnerKey;
export const currentPartnerKey = createSelector(key, (currentKey) => currentKey);
const loading = (state) => state.swAuth.loading;
export const loadingInProgress = createSelector(loading, (isLoading) => isLoading);
const community = (state) => state.swAuth.community;
export const currentCommunity = createSelector(community, (comm) => comm);
const communityAddr = (state) => state.swAuth.communityAddress;
export const communityAddress = createSelector(communityAddr, (address) => address);
const partner = (state) => state.swAuth.partnerMode;
export const partnerMode = createSelector(partner, (isPartner) => isPartner);
const sw = (state) => state.swAuth.skillWallet;
export const currentSkillWallet = createSelector(sw, (currentWallet) => currentWallet);
// SLICE
const username = (state) => state.swAuth.username;
export const currentUsername = createSelector(username, (user) => user);
const picture = (state) => state.swAuth.profileImageUrl;
export const profileImageUrl = createSelector(picture, (pic) => pic);
const tokenId = (state) => state.swAuth.tokenId;
export const currentTokenId = createSelector(tokenId, (token) => token);
const userLoggedIn = (state) => state.swAuth.isLoggedIn;
export const currentlyLoggedIn = createSelector(userLoggedIn, (loggedIn) => loggedIn);

export default swAuthSlice.reducer;
