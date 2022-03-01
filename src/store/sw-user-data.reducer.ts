import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Interface } from 'ethers/lib/utils';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface SwAuthState {
  username?: string;
  profileImageUrl?: string;
  isLoggedIn: boolean;
}

const initialState: SwAuthState = {
  username: undefined,
  profileImageUrl: undefined,
  isLoggedIn: false,
};

export interface UserData {
  username: string;
  profileImageUrl: string;
}

export interface UserState {
  username: string;
  profileImageUrl: string;
  isLoggedIn?: boolean;
}

export const swUserDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    resetUIState: () => initialState,
    setLoggedIn(state, action: ActionPayload<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setUserData(state, action: ActionPayload<UserState>) {
      state.username = action.payload.username;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const {
  // SLICE
  setUserData,
  setLoggedIn,
} = swUserDataSlice.actions;

export const currentUserState = createSelector(
  (state) => {
    return {
      username: state.userData.username,
      profileImageUrl: state.userData.profileImageUrl,
      isLoggedIn: state.userData.isLoggedIn,
    };
  },
  (userState) => userState
);

export default swUserDataSlice.reducer;
