import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import 'react-native-url-polyfill/auto';
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';
import CustomAlertComponent from './src/components/common/CustomAlert';
import { SnackbarProvider } from './src/hooks/useSnackbar';
import Navigation from './src/navigation';
import { checkAuthStatus } from './src/redux/slices/authSlice';
import { AppDispatch, RootState, store } from './src/redux/store';
import { COLORS, darkTheme, theme as lightTheme } from './src/utils/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MainApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTheme = useSelector((state: RootState) => state.ui.theme);
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

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
