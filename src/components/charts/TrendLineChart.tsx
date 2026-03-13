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
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toISOString().split('T')[0];
    const total = expenses
      .filter(exp => (exp.date || '').split('T')[0] === dateStr)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
    return { 
      day: dayName, 
      amount: total,
      index: i 
    };
  });

  return (
    <View style={styles.container}>
      <CartesianChart 
        data={dailyData} 
        xKey="index" 
        yKeys={["amount"]}
        axisOptions={{
          font: undefined,
          labelColor: theme.colors.onSurfaceVariant,
          lineColor: theme.colors.outlineVariant,
          tickCount: 7,
          formatYLabel: (v) => `AED${v}`,
          formatXLabel: (v) => {
             const item = dailyData.find(d => d.index === v);
             return item ? item.day : '';
          }
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
    height: 220,
    width: '100%',
    paddingBottom: 20,
  },
});

export default TrendLineChart;
