import { createSlice } from '@reduxjs/toolkit';

export const waiversSlice = createSlice({
  name: 'waivers',
  initialState: {
    waivers: []
  },
  reducers: {
    setWaivers: (state, action) => {
      let { waivers } = state;
      waivers = action.payload;
      return { ...state, waivers };
    }
  }
});

export const { setWaivers } = waiversSlice.actions;

export const selectWaivers = (state) => state.waivers.waivers;

export default waiversSlice.reducer;
