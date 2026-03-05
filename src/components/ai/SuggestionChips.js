import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const SuggestionChips = () => {
  return (
    <View style={styles.container}>
      <Text>SuggestionChips Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default SuggestionChips;
