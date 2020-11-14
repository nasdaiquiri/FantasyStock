import { createSlice } from '@reduxjs/toolkit';

export const ownerLeagueSlice = createSlice({
  name: 'ownerLeague',
  initialState: {
    league: null,
    settings: null,
    usersInLeague: []
  },
  reducers: {
    setOwnerLeague: (state, action) => {
      let { league } = state;
      league = action.payload;
      return { ...state, league };
    },
    setSettings: (state, action) => {
      let { settings } = state;
      settings = action.payload;
      return { ...state, settings };
    },
    setUsersInLeague: (state, action) => {
      let { usersInLeague } = state;
      usersInLeague = action.payload;
      return { ...state, usersInLeague };
    }
  }
});

export const { setOwnerLeague, setSettings, setUsersInLeague } = ownerLeagueSlice.actions;

export const selectOwnerLeague = (state) => state.ownerLeague.league;
export const selectSettings = (state) => state.ownerLeague.settings;
export const selectUsersInLeague = (state) => state.ownerLeague.usersInLeague;

export default ownerLeagueSlice.reducer;
