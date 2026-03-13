import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as expenseService from "../../api/expenseService";
import * as categoryService from "../../api/categoryService";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  image?: string;
  user: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface DateRange {
  start: string;
  end: string;
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
  categories: [],
  selectedCategory: null,
  dateRange: {
    start: new Date(new Date().setDate(1)).toISOString(), // First day of month
    end: new Date().toISOString(),
  },
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async (accountId: string, { rejectWithValue }) => {
    try {
      const docs = await expenseService.getExpenses(accountId);
      return docs.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        amount: doc.amount,
        category: doc.category,
        date: doc.date,
        image: doc.image,
        user: doc.user,
      }));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createExpense = createAsyncThunk(
  "expenses/create",
  async (data: Omit<Expense, "id">, { rejectWithValue }) => {
    try {
      const doc = await expenseService.addExpense(data);
      return {
        id: doc.$id,
        ...data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const editExpense = createAsyncThunk(
  "expenses/edit",
  async (
    { id, ...data }: { id: string } & Partial<Expense>,
    { rejectWithValue },
  ) => {
    try {
      const doc = await expenseService.updateExpense(id, data);
      return {
        id: doc.$id,
        ...data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeExpense = createAsyncThunk(
  "expenses/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCategories = createAsyncThunk(
  "expenses/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const docs = await categoryService.getCategories();
      return docs.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        icon: doc.icon,
        color: doc.color,
      }));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setFilteredExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.filteredExpenses = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchExpenses.fulfilled,
        (state, action: PayloadAction<Expense[]>) => {
          state.loading = false;
          state.expenses = action.payload;
          state.filteredExpenses = action.payload;
        },
      )
      .addCase(fetchExpenses.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(
        createExpense.fulfilled,
        (state, action: PayloadAction<Expense>) => {
          state.expenses.unshift(action.payload);
          state.filteredExpenses.unshift(action.payload);
        },
      )
      // Edit
      .addCase(editExpense.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.expenses.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = {
            ...state.expenses[index],
            ...action.payload,
          };
          state.filteredExpenses = [...state.expenses];
        }
      })
      // Remove
      .addCase(removeExpense.fulfilled, (state, action: PayloadAction<string>) => {
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
        state.filteredExpenses = state.filteredExpenses.filter(
          (e) => e.id !== action.payload,
        );
      })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      });
  },
});

export const {
  setFilteredExpenses,
  setSelectedCategory,
  setDateRange,
  clearError,
} = expensesSlice.actions;
export default expensesSlice.reducer;
export type { Expense, ExpensesState };
