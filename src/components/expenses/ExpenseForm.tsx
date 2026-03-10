import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const ExpenseForm = () => {
  return (
    <View style={styles.container}>
      <Text>ExpenseForm Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ExpenseForm;
