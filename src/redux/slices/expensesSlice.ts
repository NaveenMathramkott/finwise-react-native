import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpensesState {
  items: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  loading: false,
  error: null,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.items = action.payload;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.items.push(action.payload);
    },
  },
});

export const { setExpenses, addExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
export type { Expense, ExpensesState };
