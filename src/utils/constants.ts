import { COLORS } from "./theme";

export const APP_NAME = "FinWise";

export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
  THEME_MODE: "theme_mode",
};

export const CATEGORIES = [
  { id: "1", name: "Food", icon: "food" },
  { id: "2", name: "Transport", icon: "bus" },
  { id: "3", name: "Shopping", icon: "cart" },
  { id: "4", name: "Bills", icon: "file-document-outline" },
  { id: "5", name: "Entertainment", icon: "movie" },
  { id: "6", name: "Health", icon: "heart" },
  { id: "7", name: "Other", icon: "dots-horizontal" },
];

export const getScoreColor = (score: number) => {
  if (score >= 80) return COLORS.success;
  if (score >= 60) return COLORS.warning;
  return COLORS.error;
};

export const getScoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs Attention";
};
