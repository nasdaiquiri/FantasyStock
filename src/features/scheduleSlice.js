import { createSlice } from '@reduxjs/toolkit';

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedule: null,
    weeks: []
  },
  reducers: {
    setSchedule: (state, action) => {
      let { schedule } = state;
      schedule = action.payload;
      return { ...state, schedule };
    },
    setWeeks: (state, action) => {
      let { weeks } = state;
      weeks = action.payload;
      return { ...state, weeks };
    }
  }
});

export const { setSchedule, setWeeks } = scheduleSlice.actions;

export const selectSchedule = (state) => state.schedule.schedule;
export const selectWeeks = (state) => state.schedule.weeks;

export default scheduleSlice.reducer;
