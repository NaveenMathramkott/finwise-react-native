import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import 'react-native-url-polyfill/auto';
import { Provider as StoreProvider } from 'react-redux';
import CustomAlertComponent from './src/components/common/CustomAlert';
import { SnackbarProvider } from './src/hooks/useSnackbar';
import Navigation from './src/navigation';
import { checkAuthStatus } from './src/redux/slices/authSlice';
import { AppDispatch, RootState, store, useAppDispatch, useAppSelector } from './src/redux/store';
import { COLORS, darkTheme, theme as lightTheme } from './src/utils/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchBudgets } from './src/redux/slices/budgetSlice';
import { fetchExpenses } from './src/redux/slices/expensesSlice';

const MainApp = () => {
 const dispatch = useAppDispatch<AppDispatch>();
 const { user } = useAppSelector((state: RootState) => state.auth);

 const currentTheme = useAppSelector((state: RootState) => state.ui.theme);
 const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

 useEffect(() => {
  dispatch(checkAuthStatus());
  if (user?.accountId) {
   dispatch(fetchBudgets(user.accountId));
   dispatch(fetchExpenses(user.accountId));
  };
 }, [dispatch,user]);

 return (
  <GestureHandlerRootView style={{ flex: 1 }}>
   <PaperProvider theme={theme}>
    <SnackbarProvider>
     <StatusBar
      style={currentTheme === 'dark' ? 'light' : 'dark'}
      backgroundColor={COLORS.primary}
     />
     <Navigation />
     <CustomAlertComponent />
    </SnackbarProvider>
   </PaperProvider>
  </GestureHandlerRootView>
 );
};

export default function App() {
 return (
  <StoreProvider store={store}>
   <MainApp />
  </StoreProvider>
 );
}
