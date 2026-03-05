import { configureStore } from "@reduxjs/toolkit";
import aiReducer from "./slices/aiSlice";
import authReducer from "./slices/authSlice";
import budgetReducer from "./slices/budgetSlice";
import expensesReducer from "./slices/expensesSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    budget: budgetReducer,
    ai: aiReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
