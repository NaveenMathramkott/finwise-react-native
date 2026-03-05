import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const ErrorMessage = () => {
  return (
    <View style={styles.container}>
      <Text>ErrorMessage Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ErrorMessage;
