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
    setBudget: (state, action: PayloadAction<Budget>) => {
      const existingIndex = state.budgets.findIndex(
        (b) => b.category === action.payload.category,
      );
      if (existingIndex >= 0) {
        state.budgets[existingIndex] = action.payload;
      } else {
        state.budgets.push(action.payload);
      }
    },
  },
});

export const { setBudgets, setBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
export type { Budget, BudgetState };
