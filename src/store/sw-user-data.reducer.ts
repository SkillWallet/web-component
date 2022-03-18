import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Interface } from 'ethers/lib/utils';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface SwUserData {
  username?: string;
  profileImageUrl?: string;
  role?: string;
  commitment: number;
  isLoggedIn: boolean;
}

export const initialState: SwUserData = {
  username: '',
  profileImageUrl: undefined,
  role: undefined,
  commitment: 0,
  isLoggedIn: false,
};

export interface UserState {
  username: string;
  profileImageUrl: string;
  isLoggedIn?: boolean;
}

export const swUserDataSlice = createSlice({
  name: 'swUserData',
  initialState,
  reducers: {
    setLoggedIn(state, action: ActionPayload<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setCommitment(state, action: ActionPayload<number>) {
      console.log(action.payload);
      state.commitment = action.payload;
    },
    setRole(state, action: ActionPayload<string>) {
      state.role = action.payload;
    },
    setUserData(state, action: ActionPayload<UserState>) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

export const { setUserData, setLoggedIn, setRole, setCommitment } = swUserDataSlice.actions;

// export const currentUserState = createSelector(
//   (state) => {
//     return {
//       username: state.swUserData.username,
//       profileImageUrl: state.swUserData.profileImageUrl,
//       isLoggedIn: state.swUserData.isLoggedIn,
//     };
//   },
//   (userState) => userState
// );

export const currentUserState = (state) => state.swUserData as typeof initialState;

export default swUserDataSlice.reducer;
