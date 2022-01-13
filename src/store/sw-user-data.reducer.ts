import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ActionPayload } from './action-payload';

export interface UserData {
  username?: string;
  profileImageUrl?: string;
}

const initialState: UserData = {
  username: undefined,
  profileImageUrl: undefined,
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
  },
});

export const { setUserProfilePicture, setUserName } = swUserDataSlice.actions;

export default swUserDataSlice.reducer;
