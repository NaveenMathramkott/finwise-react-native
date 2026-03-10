import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  AddExpense: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Settings: undefined;
};

export type ReportsStackParamList = {
  Reports: undefined;
  Budget: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Expenses: NavigatorScreenParams<ExpensesStackParamList>;
  "AI Assistant": undefined;
  Reports: NavigatorScreenParams<ReportsStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
