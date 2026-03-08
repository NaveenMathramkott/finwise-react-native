import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';

export type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarContextData {
  showSnackbar: (message: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextData | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('info');
  const theme = useTheme();

  const showSnackbar = useCallback((msg: string, snackType: SnackbarType = 'info') => {
    setMessage(msg);
    setType(snackType);
    setVisible(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setVisible(false);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return  theme.colors.primary || '#4CAF50';
      case 'error':
        return theme.colors.error || '#F44336';
      case 'info':
      default:
        return theme.colors.secondary || '#2196F3';
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={3000}
        style={[
          styles.snackbar,
          { backgroundColor: getBackgroundColor() }
        ]}
        action={{
          label: 'Dismiss',
          onPress: hideSnackbar,
          labelStyle: { color: 'white' }
        }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  snackbar: {
    marginBottom: 20,
  },
});
