import { COLORS } from "./theme";

export const APP_NAME = "FinWise";

export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
  THEME_MODE: "theme_mode",
};

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

export const ICONS = [
  "fast-food",
  "car",
  "cart",
  "document-text",
  "film",
  "medical",
  "school",
  "ellipsis-horizontal",
  "home",
  "shirt",
  "fitness",
  "airplane",
  "cafe",
  "gift",
  "heart",
  "card",
  "briefcase",
  "wallet",
];

export const PRESET_COLORS = [
  "#FF7043",
  "#42A5F5",
  "#AB47BC",
  "#FFCA28",
  "#EF5350",
  "#66BB6A",
  "#5C6BC0",
  "#78909C",
  "#4DB6AC",
  "#E57373",
  "#BA68C8",
  "#7986CB",
  "#009688",
  "#00BCD4",
  "#8BC34A",
  "#CDDC39",
];
