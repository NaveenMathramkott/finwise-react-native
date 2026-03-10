import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { CartesianChart, Line } from 'victory-native';

interface TrendLineChartProps {
  expenses: any[];
}

const TrendLineChart = ({ expenses }: TrendLineChartProps) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  if (expenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          No trend data available
        </Text>
      </View>
    );
  }

  // Last 7 days trend
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const total = expenses
      .filter(exp => exp.date === dateStr)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { day: i, amount: total };
  });

  return (
    <View style={styles.container}>
      <CartesianChart 
        data={dailyData} 
        xKey="day" 
        yKeys={["amount"]}
        axisOptions={{
          font: undefined, // Will use default system font
          labelColor: theme.colors.onSurfaceVariant,
          lineColor: theme.colors.outlineVariant,
        }}
      >
        {({ points }) => (
          <Line
            points={points.amount}
            color={theme.colors.primary}
            strokeWidth={3}
            animate={{ type: "timing", duration: 500 }}
          />
        )}
      </CartesianChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    paddingTop: 10,
  },
});

export default TrendLineChart;
