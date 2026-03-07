import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const COLORS = {
  primary: "#07787aff", // Deep Green
  secondary: "#81C784",
  accent: "#FFA000",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  error: "#B00020",
  text: "#212121",
  textSecondary: "#757575",
  border: "#E0E0E0",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    tertiary: COLORS.accent,
    error: COLORS.error,
    background: COLORS.background,
    surface: COLORS.surface,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    tertiary: COLORS.accent,
    error: COLORS.error,
  },
};
