import { createSlice } from '@reduxjs/toolkit';

const budgetSlice = createSlice({
  name: 'budget',
  initialState: { budgets: [], loading: false },
  reducers: {
    setBudgets: (state, action) => { state.budgets = action.payload; },
  },
});
export const { setBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
