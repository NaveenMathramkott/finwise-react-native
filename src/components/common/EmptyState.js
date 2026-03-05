import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text>EmptyState Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default EmptyState;
