import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AppNavigator from './AppNavigator';

const Navigation = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
