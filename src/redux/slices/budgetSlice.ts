import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Budget {
  category: string;
  limit: number;
  spent: number;
}

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload;
    },
  },
});

export const { setBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
export type { Budget, BudgetState };
