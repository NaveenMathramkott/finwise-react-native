import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const BudgetProgressBar = () => {
  return (
    <View style={styles.container}>
      <Text>BudgetProgressBar Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default BudgetProgressBar;
