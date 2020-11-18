import { createSlice } from '@reduxjs/toolkit';

export const yourStockSlice = createSlice({
  name: 'yourstock',
  initialState: {
    yourstock: []
  },
  reducers: {
    setYourStock: (state, action) => {
      let { yourstock } = state;
      yourstock = action.payload;
      return { ...state, yourstock };
    }
  }
});

export const { setYourStock } = yourStockSlice.actions;

export const selectYourStock = (state) => state.yourstock.yourstock;

export default yourStockSlice.reducer;
