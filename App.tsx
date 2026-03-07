import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Provider as StoreProvider, useSelector } from 'react-redux';
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
        <StatusBar 
          style={currentTheme === 'dark' ? 'light' : 'dark'} 
          backgroundColor={theme.colors.background}
        />
        <Navigation />
        <Toast />
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
