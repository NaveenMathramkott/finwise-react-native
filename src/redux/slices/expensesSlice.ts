import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as expenseService from "../../api/expenseService";
import * as budgetService from "../../api/budgetService";
import { updateLocalSpent } from "./budgetSlice";
import { RootState } from "../store";

interface Expense {
  id: string;
  title: string;
  amount: number;
  budgetId: string;
  date: string;
  image?: string;
  user: string;
}

interface DateRange {
  start: string;
  end: string;
}

interface ExpensesState {
  expenses: Expense[];
  filteredExpenses: Expense[];
  dateRange: DateRange;
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  filteredExpenses: [],
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
        budgetId: doc.budget, // Mapping Appwrite's 'budget' field to our 'budgetId'
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
  async (data: Omit<Expense, "id">, { dispatch, getState, rejectWithValue }) => {
    try {
      // Map budgetId to Appwrite's 'budget' field
      const apiData = {
        ...data,
        budget: data.budgetId,
      };
      // @ts-ignore
      delete apiData.budgetId;

      const doc = await expenseService.addExpense(apiData);
      const expense = {
        id: doc.$id,
        ...data,
      };

      // Update budget spent
      const state = getState() as RootState;
      const budget = state.budget.budgets.find((b) => b.id === data.budgetId);
      if (budget) {
        const newSpent = (budget.spent || 0) + data.amount;
        await budgetService.updateBudget(budget.id, { spent: newSpent });
        dispatch(updateLocalSpent({ id: budget.id, spent: newSpent }));
      }

      return expense;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const editExpense = createAsyncThunk(
  "expenses/edit",
  async (
    { id, ...data }: { id: string } & Partial<Expense>,
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const oldExpense = state.expenses.expenses.find((e) => e.id === id);
      
      // Map budgetId to Appwrite's 'budget' field if it exists in the update
      const apiData = { ...data };
      if (apiData.budgetId) {
        (apiData as any).budget = apiData.budgetId;
        delete apiData.budgetId;
      }

      const doc = await expenseService.updateExpense(id, apiData);
      const updatedExpense = {
        id: doc.$id,
        ...data,
      };

      // Update budget spent logic
      if (oldExpense) {
        const budgets = state.budget.budgets;
        
        // Scenario 1: Budget changed
        if (data.budgetId && data.budgetId !== oldExpense.budgetId) {
          // Subtract from old budget
          const oldBudget = budgets.find(b => b.id === oldExpense.budgetId);
          if (oldBudget) {
            const newSpentOld = Math.max(0, (oldBudget.spent || 0) - oldExpense.amount);
            await budgetService.updateBudget(oldBudget.id, { spent: newSpentOld });
            dispatch(updateLocalSpent({ id: oldBudget.id, spent: newSpentOld }));
          }
          
          // Add to new budget
          const newBudget = budgets.find(b => b.id === data.budgetId);
          if (newBudget) {
            const amountToUse = data.amount !== undefined ? data.amount : oldExpense.amount;
            const newSpentNew = (newBudget.spent || 0) + amountToUse;
            await budgetService.updateBudget(newBudget.id, { spent: newSpentNew });
            dispatch(updateLocalSpent({ id: newBudget.id, spent: newSpentNew }));
          }
        } 
        // Scenario 2: Amount changed, but budget is same
        else if (data.amount !== undefined && data.amount !== oldExpense.amount) {
          const budget = budgets.find(b => b.id === (data.budgetId || oldExpense.budgetId));
          if (budget) {
            const newSpent = (budget.spent || 0) - oldExpense.amount + data.amount;
            await budgetService.updateBudget(budget.id, { spent: newSpent });
            dispatch(updateLocalSpent({ id: budget.id, spent: newSpent }));
          }
        }
      }

      return updatedExpense;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeExpense = createAsyncThunk(
  "expenses/remove",
  async (id: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const expense = state.expenses.expenses.find((e) => e.id === id);

      await expenseService.deleteExpense(id);

      // Update budget spent
      if (expense) {
        const budget = state.budget.budgets.find(b => b.id === expense.budgetId);
        if (budget) {
          const newSpent = Math.max(0, (budget.spent || 0) - expense.amount);
          await budgetService.updateBudget(budget.id, { spent: newSpent });
          dispatch(updateLocalSpent({ id: budget.id, spent: newSpent }));
        }
      }

      return id;
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
        const index = state.expenses.findIndex(
          (e) => e.id === action.payload.id,
        );
        if (index !== -1) {
          state.expenses[index] = {
            ...state.expenses[index],
            ...action.payload,
          };
          state.filteredExpenses = [...state.expenses];
        }
      })
      // Remove
      .addCase(
        removeExpense.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.expenses = state.expenses.filter(
            (e) => e.id !== action.payload,
          );
          state.filteredExpenses = state.filteredExpenses.filter(
            (e) => e.id !== action.payload,
          );
        },
      );
  },
});

export const { setFilteredExpenses, setDateRange, clearError } =
  expensesSlice.actions;
export default expensesSlice.reducer;
export type { Expense, ExpensesState };

