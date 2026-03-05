import { createSlice } from '@reduxjs/toolkit';

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    setExpenses: (state, action) => { state.items = action.payload; },
  },
});
export const { setExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
