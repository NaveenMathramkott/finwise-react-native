import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
 RefreshControl,
 ScrollView,
 StyleSheet,
 TouchableOpacity,
 View,
} from 'react-native';
import { Avatar, Card, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import SpendingPieChart from '../../components/charts/SpendingPieChart';
import TrendLineChart from '../../components/charts/TrendLineChart';
import ExpenseCard from '../../components/expenses/ExpenseCard';
import TransactionDetailSheet from '../../components/expenses/TransactionDetailSheet';
import { fetchExpenses, removeExpense } from '../../redux/slices/expensesSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';
import { CustomAlert } from '../../utils/AlertService';

const DashboardScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { expenses } = useAppSelector((state: RootState) => state.expenses);
  const { budgets } = useAppSelector((state: RootState) => state.budget);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
    if (user?.accountId) {
      dispatch(fetchExpenses(user.accountId));
    }
  }, [dispatch, user?.accountId]);

  // Calculate statistics
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageDaily = totalSpent / 30;
  const largestExpense = expenses.length > 0
    ? Math.max(...expenses.map(e => e.amount))
    : 0;

  const recentExpenses = expenses.slice(0, 5);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (user?.accountId) {
      dispatch(fetchExpenses(user.accountId));
     }
     setRefreshing(false);
  }, []);

  const [selectedExpense, setSelectedExpense] = React.useState<any>(null);
  const [detailVisible, setDetailVisible] = React.useState(false);

  const hideModal = () => {
    setDetailVisible(false);
    setSelectedExpense(null);
  };

  const showDetail = (expense: any) => {
    setSelectedExpense(expense);
    setDetailVisible(true);
  };

  const handleDelete = (id: string) => {
    hideModal();
    CustomAlert.alert(
      'Delete Expense',
      'EXPENSE',
      'Are you sure you want to delete this expense permanent?',
      () => dispatch(removeExpense(id))
    );
  };

  const handleEdit = (expense: any) => {
    hideModal();
    navigation.navigate('AddExpense', { expense });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top Primary Background */}
        <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

        {/* Animated Header */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
          <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
            <View style={styles.headerTop}>
              <View style={styles.nameWrapper}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Welcome back,</Text>
                <Text variant="headlineSmall" style={styles.userName} numberOfLines={1}>
                  {user?.name || 'User'} 👋
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Avatar.Text
                  size={54}
                  label={user?.name?.charAt(0) || 'U'}
                  style={{ backgroundColor: theme.colors.primary, elevation: 4 }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.statsOverview}>
              <View style={styles.statBox}>
                <View style={[styles.iconCircle, { backgroundColor: '#4CAF5015' }]}>
                  <Ionicons name="wallet-outline" size={20} color="#4CAF50" />
                </View>
                <Text variant="labelSmall" style={styles.statLabel}>Total Spent</Text>
                <Text variant="titleMedium" style={styles.statValue}>AED{Number(totalSpent).toFixed(2)}</Text>
              </View>
              <Divider vertical />
              <View style={styles.statBox}>
                <View style={[styles.iconCircle, { backgroundColor: '#2196F315' }]}>
                  <Ionicons name="calendar-outline" size={20} color="#2196F3" />
                </View>
                <Text variant="labelSmall" style={styles.statLabel}>Daily Avg</Text>
                <Text variant="titleMedium" style={styles.statValue}>AED{Number(averageDaily).toFixed(2)}</Text>
              </View>
              <Divider vertical />
              <View style={styles.statBox}>
                <View style={[styles.iconCircle, { backgroundColor: '#F4433615' }]}>
                  <Ionicons name="trending-up-outline" size={20} color="#F44336" />
                </View>
                <Text variant="labelSmall" style={styles.statLabel}>Largest</Text>
                <Text variant="titleMedium" style={styles.statValue}>AED{Number(largestExpense).toFixed(2)}</Text>
              </View>
            </View>
          </Surface>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.content}>
          {/* Charts Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Insights</Text>
          <Card style={styles.chartCard}>
            <View style={styles.cardHeader}>
                <Text variant="titleSmall" style={styles.cardTitle}>Spending by Category</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                    <Text variant="labelLarge" style={{ color: theme.colors.primary }}>Analysis</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.chartWrapper}>
              <SpendingPieChart expenses={expenses} budgets={budgets} />
            </View>
          </Card>

          <Card style={[styles.chartCard, { marginTop: 16 }]}>
            <View style={styles.cardHeader}>
              <Text variant="titleSmall" style={styles.cardTitle}>Spending Trend</Text>
            </View>
            <View style={styles.chartWrapper}>
              <TrendLineChart expenses={expenses} />
            </View>
          </Card>

          {/* Recent Activity */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitleText}>Recent Expenses</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                <Text variant="labelLarge" style={{ color: theme.colors.primary }}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense, index) => (
                <Animated.View key={expense.id} entering={FadeInDown.delay(300 + index * 100)}>
                  <TouchableOpacity onPress={() => showDetail(expense)}>
                    <ExpenseCard expense={expense} paddingHoz={0} />
                  </TouchableOpacity>
                </Animated.View>
              ))
            ) : (
              <Surface style={styles.emptyState} elevation={0}>
                <Ionicons name="receipt-outline" size={48} color={theme.colors.onSurfaceVariant} />
                <Text style={{ marginTop: 12, opacity: 0.6 }}>No transactions yet</Text>
              </Surface>
            )}
          </View>

          {/* Quick Access Grid */}
          <View style={styles.quickGrid}>
              <QuickButton 
                icon="add-outline" 
                label="Expense" 
                onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense' })} 
                color={theme.colors.primary}
              />
              <QuickButton 
                icon="chatbubble-ellipses-outline" 
                label="AI Tutor" 
                onPress={() => navigation.navigate('AI Assistant')} 
                color="#673AB7"
              />
              <QuickButton 
                icon="bar-chart-outline" 
                label="Reports" 
                onPress={() => navigation.navigate('Reports')} 
                color="#FF9800"
              />
          </View>
        </Animated.View>
      </ScrollView>

      <TransactionDetailSheet 
        visible={detailVisible}
        onDismiss={hideModal}
        expense={selectedExpense}
        budgets={budgets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );
};

const Divider = ({ vertical }: { vertical?: boolean }) => (
    <View style={{ 
        width: vertical ? 1 : '100%', 
        height: vertical ? '60%' : 1, 
        backgroundColor: 'rgba(0,0,0,0.05)' 
    }} />
);

const QuickButton = ({ icon, label, onPress, color }: any) => (
    <TouchableOpacity style={styles.quickItem} onPress={onPress}>
        <Surface style={[styles.quickIcon, { backgroundColor: color + '15' }]} elevation={0}>
            <Ionicons name={icon} size={24} color={color} />
        </Surface>
        <Text variant="labelSmall" style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
);

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
  headerWrapper: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  headerCard: {
    borderRadius: 32,
    padding: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  nameWrapper:{
    width: '80%',
  },
  userName: {
    fontWeight: 'bold',
    width:"100%"
  },
  statsOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    opacity: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 15,
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
  chartCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: '600',
    opacity: 0.7,
  },
  chartWrapper: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentSection: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleText: {
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  quickGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 24,
      marginBottom: 40,
  },
  quickItem: {
      alignItems: 'center',
  },
  quickIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
  },
  quickLabel: {
      opacity: 0.6,
      fontWeight: '600',
  }
});

export default DashboardScreen;