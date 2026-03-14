import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Pie, PolarChart } from 'victory-native';

interface SpendingPieChartProps {
  expenses: any[];
  budgets: any[];
}

const SpendingPieChart = ({ expenses, budgets }: SpendingPieChartProps) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const data = React.useMemo(() => {
    if (!budgets || !expenses) return [];

    const expenseTotals: Record<string, number> = {};
    expenses.forEach(exp => {
      const bId = exp.budgetId || exp.category; // support migration
      expenseTotals[bId] = (expenseTotals[bId] || 0) + Number(exp.amount || 0);
    });

    const matchedBudgetIds = new Set<string>();
    const chartData = budgets.map(budget => {
      matchedBudgetIds.add(budget.id);
      
      return {
        name: budget.name,
        value: expenseTotals[budget.id] || 0,
        color: budget.color || theme.colors.primary,
        id: budget.id
      };
    });

    let otherTotal = 0;
    Object.keys(expenseTotals).forEach(id => {
      if (!matchedBudgetIds.has(id)) {
        otherTotal += expenseTotals[id];
      }
    });

    const finalData = chartData.filter(item => item.value > 0);

    if (otherTotal > 0) {
      finalData.push({
        name: 'Other',
        value: otherTotal,
        color: '#95A5A6',
        id: 'other-cat'
      });
    }

    return finalData;
  }, [budgets, expenses, theme.colors.primary]);
  

  if (expenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          No data available for chart
        </Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.6 }}>
          No categorized spending yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.layout}>
        <View style={styles.chartWrapper}>
          <PolarChart
            data={data}
            labelKey="name"
            valueKey="value"
            colorKey="color"
          >
            <Pie.Chart innerRadius={50} />
          </PolarChart>
          <View style={styles.centerLabel}>
            <Text variant="labelSmall" style={{ opacity: 0.5 }}>TOTAL</Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              AED{data.reduce((sum, item) => sum + item.value, 0).toFixed(0)}
            </Text>
          </View>
        </View>

        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <View style={styles.legendText}>
                <Text variant="labelSmall" numberOfLines={1}>{item.name}</Text>
                <Text variant="labelSmall" style={{ opacity: 0.6 }}>AED{item.value.toFixed(0)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: '100%',
  },
  layout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartWrapper: {
    width: 160,
    height: 160,
    position: 'relative',
  },
  centerLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    paddingLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
  },
});

export default SpendingPieChart;
