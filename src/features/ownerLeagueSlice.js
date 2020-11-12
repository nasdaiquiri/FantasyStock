import { createSlice } from '@reduxjs/toolkit';

export const ownerLeagueSlice = createSlice({
  name: 'ownerLeague',
  initialState: {
    league: null,
    settings: null
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
    }
  }
});

export const { setOwnerLeague, setSettings } = ownerLeagueSlice.actions;

export const selectOwnerLeague = (state) => state.ownerLeague.league;
export const selectSettings = (state) => state.ownerLeague.settings;

export default ownerLeagueSlice.reducer;
