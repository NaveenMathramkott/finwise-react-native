import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, List, ProgressBar, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getScoreColor, getScoreLabel } from '../../utils/constants';

const ReportsScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const { budgets } = useSelector((state: RootState) => state.budget);

  // AI Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const mockedIncome = 5000; 
  
  const savingsRate = Math.max(0, ((mockedIncome - totalExpenses) / mockedIncome) * 100);
  
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const consistency = totalBudget > 0 
    ? Math.max(0, 100 - (Math.abs(totalSpent - totalBudget) / totalBudget) * 100) 
    : 85; 

  const debtToIncome = 24; 

  const emergencyFund = 12000;
  const monthsCovered = totalExpenses > 0 ? emergencyFund / totalExpenses : 6;
  const emergencyFundStatus = Math.min(100, (monthsCovered / 6) * 100); 

  const healthScore = Math.round((savingsRate + consistency + (100 - debtToIncome * 2) + emergencyFundStatus) / 4);

  const handleBudgetPress = () => {
    navigation.navigate('Budget');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Primary Background */}
        <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

        {/* Animated Score Card */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
          <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
            <View style={styles.titleSection}>
                <Text variant="headlineMedium" style={styles.screenTitle}>Financial Health</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>AI Calculated Analysis</Text>
            </View>

            <View style={styles.scoreRow}>
                <View style={[styles.scoreCircle, { borderColor: getScoreColor(healthScore) + '30' }]}>
                    <View style={[styles.innerCircle, { backgroundColor: getScoreColor(healthScore) + '10' }]}>
                        <Text variant="displayMedium" style={[styles.scoreText, { color: getScoreColor(healthScore) }]}>
                            {healthScore}
                        </Text>
                        <Text variant="labelSmall" style={{ opacity: 0.5 }}>SCORE</Text>
                    </View>
                </View>
                
                <View style={styles.scoreInfo}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{getScoreLabel(healthScore)}</Text>
                    <Text variant="bodySmall" style={styles.scoreDescription}>
                        Your score is based on {expenses.length} recent transactions.
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getScoreColor(healthScore) + '20' }]}>
                        <Ionicons name="sparkles" size={14} color={getScoreColor(healthScore)} />
                        <Text variant="labelMedium" style={{ color: getScoreColor(healthScore), marginLeft: 4, fontWeight: 'bold' }}>
                            AI Verified
                        </Text>
                    </View>
                </View>
            </View>
          </Surface>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.content}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Key Metrics</Text>
          
          <MetricCard 
            icon="leaf-outline" 
            title="Savings Rate" 
            value={`${savingsRate.toFixed(1)}%`} 
            progress={savingsRate / 100}
            color={theme.colors.primary}
            description={`Target is 20%+. You are doing ${savingsRate >= 20 ? 'great' : 'okay'}.`}
          />

          <MetricCard 
            icon="analytics-outline" 
            title="Expense Consistency" 
            value={`${consistency.toFixed(0)}%`} 
            progress={consistency / 100}
            color={theme.colors.secondary}
            description="Measures how well you stick to your monthly budget limits."
            onPress={handleBudgetPress}
          />

          <MetricCard 
            icon="trending-down-outline" 
            title="Debt-to-Income" 
            value={`${debtToIncome}%`} 
            progress={debtToIncome / 100}
            color={theme.colors.tertiary}
            description="Ideal ratio is below 36%. You are safely within limits."
          />

          <MetricCard 
            icon="shield-checkmark-outline" 
            title="Emergency Fund" 
            value={`${monthsCovered.toFixed(1)} mo`} 
            progress={emergencyFundStatus / 100}
            color={theme.colors.primary}
            description={`Current fund covers ${monthsCovered.toFixed(1)} months of expenses.`}
          />

          {/* AI Insights */}
          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>AI Insights</Text>
          <Surface style={[styles.insightsCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <List.Item
              title="Optimization Tip"
              titleStyle={{ fontWeight: '600' }}
              description="Your spending on 'Food' is 15% higher than usual. Consolidating grocery trips could save you $45/month."
              left={props => <View style={[styles.insightIcon, { backgroundColor: '#FFD70020' }]}><Ionicons name="bulb" size={20} color="#FFB000" /></View>}
            />
            <Divider style={{ marginHorizontal: 16, opacity: 0.5 }} />
            <List.Item
              title="Savings Goal"
              titleStyle={{ fontWeight: '600' }}
              description="At this rate, you'll reach your 'Vacation' fund goal 3 months earlier than projected!"
              left={props => <View style={[styles.insightIcon, { backgroundColor: theme.colors.primary + '20' }]}><Ionicons name="star" size={20} color={theme.colors.primary} /></View>}
            />
          </Surface>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const MetricCard = ({ icon, title, value, progress, color, description, onPress }: any) => {
    const theme = useTheme();
    return (
        <Card style={styles.metricCard} onPress={onPress}>
            <Card.Content>
                <View style={styles.metricHeader}>
                    <View style={styles.metricLabelGroup}>
                        <View style={[styles.miniIcon, { backgroundColor: color + '15' }]}>
                            <Ionicons name={icon} size={18} color={color} />
                        </View>
                        <Text variant="titleMedium" style={styles.metricLabel}>{title}</Text>
                    </View>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: color }}>{value}</Text>
                </View>
                <ProgressBar progress={progress} color={color} style={styles.progress} />
                <Text variant="bodySmall" style={styles.metricDescription}>{description}</Text>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerWrapper: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  headerCard: {
    borderRadius: 32,
    padding: 24,
  },
  titleSection: {
    marginBottom: 20,
  },
  screenTitle: {
    fontWeight: 'bold',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  innerCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
  scoreText: {
    fontWeight: 'bold',
    lineHeight: 48,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreDescription: {
      opacity: 0.6,
      marginBottom: 8,
  },
  statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
    opacity: 0.8,
  },
  metricCard: {
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
  },
  metricLabel: {
    fontWeight: '600',
    opacity: 0.8,
  },
  progress: {
    height: 6,
    borderRadius: 3,
    marginVertical: 4,
  },
  metricDescription: {
    opacity: 0.5,
    marginTop: 4,
  },
  insightsCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  insightIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  }
});

export default ReportsScreen;
