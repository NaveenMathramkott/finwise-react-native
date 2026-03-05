import { createSlice } from "@reduxjs/toolkit";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}
interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}
interface DateRange {
  start: Date;
  end: Date;
}

interface ExpensesState {
  expenses: Expense[];
  filteredExpenses: Expense[];
  categories: Category[];
  selectedCategory: Category | null;
  dateRange: DateRange;
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  filteredExpenses: [],
  categories: [
    { id: 1, name: "Food", icon: "fast-food", color: "#FF6B6B" },
    { id: 2, name: "Transport", icon: "car", color: "#4ECDC4" },
    { id: 3, name: "Shopping", icon: "cart", color: "#45B7D1" },
    { id: 4, name: "Entertainment", icon: "film", color: "#96CEB4" },
    { id: 5, name: "Bills", icon: "document-text", color: "#FFE194" },
    { id: 6, name: "Healthcare", icon: "medical", color: "#E6B89C" },
    { id: 7, name: "Education", icon: "school", color: "#9B59B6" },
    { id: 8, name: "Other", icon: "ellipsis-horizontal", color: "#95A5A6" },
  ],
  selectedCategory: null,
  dateRange: {
    start: new Date(new Date().setDate(1)), // First day of month
    end: new Date(),
  },
  loading: false,
  error: null,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.filteredExpenses = action.payload;
    },
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload);
      state.filteredExpenses.unshift(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
        state.filteredExpenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      state.filteredExpenses = state.filteredExpenses.filter(
        (e) => e.id !== action.payload,
      );
    },
    setFilteredExpenses: (state, action) => {
      state.filteredExpenses = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setFilteredExpenses,
  setSelectedCategory,
  setDateRange,
  setLoading,
  setError,
} = expensesSlice.actions;
export default expensesSlice.reducer;
export type { Expense, ExpensesState };

