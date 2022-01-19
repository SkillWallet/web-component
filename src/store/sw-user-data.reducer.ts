import { createReducer, createSelector, createSlice } from '@reduxjs/toolkit';
import { ActionPayload } from './action-payload';

export interface UserData {
  username?: string;
  profileImageUrl?: string;
  tokenId?: string;
}

const initialState: UserData = {
  username: undefined,
  profileImageUrl: undefined,
  tokenId: undefined,
};

export const swUserDataSlice = createSlice({
  name: 'swUserData',
  initialState,
  reducers: {
    setUserProfilePicture(state, action: ActionPayload<string>) {
      state.profileImageUrl = action.payload;
    },
    setUserName(state, action: ActionPayload<string>) {
      state.username = action.payload;
    },
    setTokenId(state, action: ActionPayload<string>) {
      console.log('SETTING TOKEN ID', action.payload);
      state.tokenId = action.payload;
    },
  },
});

export const { setUserProfilePicture, setUserName, setTokenId } = swUserDataSlice.actions;

const username = (state) => state.username;
export const currentUsername = createSelector(username, (user) => user);
const tokenId = (state) => state.tokenId;
export const currentTokenId = createSelector(tokenId, (token) => token);

export default swUserDataSlice.reducer;
