import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useSelector } from 'react-redux';
import CustomAlertComponent from './src/components/common/CustomAlert';
import { SnackbarProvider } from './src/hooks/useSnackbar';
import Navigation from './src/navigation';
import { RootState, store } from './src/redux/store';
import { darkTheme, theme as lightTheme } from './src/utils/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MainApp = () => {
  const currentTheme = useSelector((state: RootState) => state.ui.theme);
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <SnackbarProvider>
          <StatusBar 
          style={currentTheme === 'dark' ? 'light' : 'dark'} 
          backgroundColor={theme.colors.background}
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
