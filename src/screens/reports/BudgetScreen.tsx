import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Divider, ProgressBar, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const BudgetScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { budgets } = useSelector((state: RootState) => state.budget);
  const { categories } = useSelector((state: RootState) => state.expenses);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallProgress = totalBudget > 0 ? totalSpent / totalBudget : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Background */}
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <Text variant="headlineSmall" style={styles.screenTitle}>Monthly Budget</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.overallSection}>
            <View style={styles.overallHeader}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Overall Spending</Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {Math.round(overallProgress * 100)}%
                </Text>
            </View>
            <ProgressBar 
                progress={overallProgress} 
                color={overallProgress > 0.9 ? theme.colors.error : theme.colors.primary} 
                style={styles.mainProgress} 
            />
            <View style={styles.overallStats}>
                <View>
                    <Text variant="labelSmall" style={styles.statLabel}>Spent</Text>
                    <Text variant="titleSmall" style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
                </View>
                <Divider style={styles.verticalDivider} />
                <View style={{ alignItems: 'flex-end' }}>
                    <Text variant="labelSmall" style={styles.statLabel}>Limit</Text>
                    <Text variant="titleSmall" style={styles.statValue}>${totalBudget.toFixed(2)}</Text>
                </View>
            </View>
          </View>
        </Surface>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Category Budgets</Text>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {budgets.length > 0 ? (
              budgets.map((budget, index) => {
                  const category = categories.find(c => c.name === budget.category);
                  const progress = budget.limit > 0 ? budget.spent / budget.limit : 0;
                  const isOver = progress > 1;

                  return (
                      <Animated.View key={budget.category} entering={FadeInDown.delay(300 + index * 100)}>
                          <Card style={styles.budgetCard}>
                              <Card.Content>
                                  <View style={styles.budgetHeader}>
                                      <View style={styles.catInfo}>
                                          <View style={[styles.iconBox, { backgroundColor: (category?.color || theme.colors.primary) + '15' }]}>
                                              <Ionicons name={(category?.icon || 'help-circle') as any} size={18} color={category?.color || theme.colors.primary} />
                                          </View>
                                          <Text variant="titleMedium" style={styles.catName}>{budget.category}</Text>
                                      </View>
                                      <Text variant="bodySmall" style={isOver ? { color: theme.colors.error, fontWeight: 'bold' } : { opacity: 0.6 }}>
                                          ${budget.spent.toFixed(0)} / ${budget.limit.toFixed(0)}
                                      </Text>
                                  </View>
                                  
                                  <ProgressBar 
                                      progress={Math.min(progress, 1)} 
                                      color={isOver ? theme.colors.error : (category?.color || theme.colors.primary)} 
                                      style={styles.categoryProgress} 
                                  />
                                  
                                  <View style={styles.budgetFooter}>
                                      <Text variant="labelSmall" style={{ opacity: 0.5 }}>
                                          {isOver ? 'Exceeded by' : 'Remaining'}
                                      </Text>
                                      <Text variant="labelSmall" style={{ fontWeight: 'bold', color: isOver ? theme.colors.error : '#4CAF50' }}>
                                          ${Math.abs(budget.limit - budget.spent).toFixed(2)}
                                      </Text>
                                  </View>
                              </Card.Content>
                          </Card>
                      </Animated.View>
                  );
              })
          ) : (
              <View style={styles.emptyState}>
                  <Ionicons name="pie-chart-outline" size={64} color={theme.colors.onSurfaceVariant} />
                  <Text variant="bodyLarge" style={{ marginTop: 16, opacity: 0.6 }}>No budgets set yet</Text>
              </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
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
    height: 200,
  },
  headerWrapper: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  headerCard: {
    borderRadius: 32,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
      padding: 4,
  },
  screenTitle: {
    fontWeight: 'bold',
  },
  overallSection: {
      marginTop: 8,
  },
  overallHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
  mainProgress: {
      height: 12,
      borderRadius: 6,
      marginBottom: 16,
  },
  overallStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  statLabel: {
      opacity: 0.5,
      textTransform: 'uppercase',
  },
  statValue: {
      fontWeight: 'bold',
  },
  verticalDivider: {
      width: 1,
      height: 30,
      backgroundColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
    opacity: 0.8,
  },
  scrollContent: {
      paddingBottom: 40,
  },
  budgetCard: {
      marginBottom: 12,
      borderRadius: 24,
      backgroundColor: 'white',
      elevation: 2,
  },
  budgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  catInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  iconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
  },
  catName: {
      fontWeight: '600',
  },
  categoryProgress: {
      height: 8,
      borderRadius: 4,
  },
  budgetFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
  },
  emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
      opacity: 0.5,
  }
});

export default BudgetScreen;
