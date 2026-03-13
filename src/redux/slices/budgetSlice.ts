import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as budgetService from "../../api/budgetService";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  user: string;
}

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  "budget/fetchAll",
  async (accountId: string, { rejectWithValue }) => {
    try {
      const docs = await budgetService.getBudgets(accountId);
      return docs.map((doc: any) => ({
        id: doc.$id,
        category: doc.category,
        limit: doc.limit,
        spent: doc.spent,
        user: doc.user,
      }));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createBudget = createAsyncThunk(
  "budget/create",
  async (data: Omit<Budget, "id">, { rejectWithValue }) => {
    try {
      const doc = await budgetService.addBudget(data);
      return {
        id: doc.$id,
        ...data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const editBudget = createAsyncThunk(
  "budget/edit",
  async (
    { id, ...data }: { id: string } & Partial<Budget>,
    { rejectWithValue },
  ) => {
    try {
      const doc = await budgetService.updateBudget(id, data);
      return {
        id: doc.$id,
        ...data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeBudget = createAsyncThunk(
  "budget/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchBudgets.fulfilled,
        (state, action: PayloadAction<Budget[]>) => {
          state.loading = false;
          state.budgets = action.payload;
        },
      )
      .addCase(fetchBudgets.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.budgets.push(action.payload);
      })
      .addCase(editBudget.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = {
            ...state.budgets[index],
            ...action.payload,
          };
        }
      })
      .addCase(removeBudget.fulfilled, (state, action: PayloadAction<string>) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
      });
  },
});

export const { clearError } = budgetSlice.actions;
export default budgetSlice.reducer;
export type { Budget, BudgetState };
