import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    logIn: false
  },
  reducers: {
    setUser: (state, action) => {
      let { user } = state;
      user = action.payload;
      return { ...state, user };
    },
    setLogIn: (state, action) => {
      let { logIn } = state;
      logIn = action.payload;
      return { ...state, logIn };
    }
  }
});

export const { setUser, setLogIn } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectLogIn = (state) => state.user.logIn;

export default userSlice.reducer;
