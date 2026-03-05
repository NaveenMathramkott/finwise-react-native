import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import Navigation from './src/navigation';
import { store } from './src/redux/store';
import { theme } from './src/utils/theme';

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </StoreProvider>
  );
}
