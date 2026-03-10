import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Pie, PolarChart } from 'victory-native';

interface SpendingPieChartProps {
  expenses: any[];
  categories: any[];
}

const SpendingPieChart = ({ expenses, categories }: SpendingPieChartProps) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  if (expenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          No data available for chart
        </Text>
      </View>
    );
  }

  // Group expenses by category
  const data = categories.map(cat => {
    const total = expenses
      .filter(exp => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { name: cat.name, value: total, color: cat.color };
  }).filter(item => item.value > 0);

  return (
    <View style={styles.container}>
      <View style={{ width: screenWidth - 60, height: 220 }}>
        <PolarChart
          data={data}
          labelKey="name"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius={50} />
        </PolarChart>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default SpendingPieChart;
