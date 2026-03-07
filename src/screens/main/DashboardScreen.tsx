import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
 RefreshControl,
 ScrollView,
 StyleSheet,
 TouchableOpacity,
 View,
} from 'react-native';
import { Avatar, Button, Card, IconButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import SpendingPieChart from '../../components/charts/SpendingPieChart';
import TrendLineChart from '../../components/charts/TrendLineChart';
import ExpenseCard from '../../components/expenses/ExpenseCard';
import { RootState } from '../../redux/store';

const DashboardScreen = ({ navigation }: any) => {
 const theme = useTheme();
 const { expenses, categories } = useSelector((state: RootState) => state.expenses);
 const { user } = useSelector((state: RootState) => state.auth);
 const [refreshing, setRefreshing] = React.useState(false);

 // Calculate statistics
 const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
 const averageDaily = totalSpent / 30;
 const largestExpense = expenses.length > 0
  ? Math.max(...expenses.map(e => e.amount))
  : 0;

 const recentExpenses = expenses.slice(0, 5);

 const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setTimeout(() => setRefreshing(false), 2000);
 }, []);

 return (
  <SafeAreaView
   style={[styles.container, { backgroundColor: theme.colors.background }]}
  >
   <ScrollView
    refreshControl={
     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
    }
   >
    {/* Header */}
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
     <View>
      <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
       Hello, {user?.name || 'User'}!
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
       {new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
       })}
      </Text>
     </View>
     <TouchableOpacity onPress={() => navigation.navigate('MainProfile')}>
      <Avatar.Text
       size={48}
       label={user?.name?.charAt(0) || 'U'}
       style={{ backgroundColor: theme.colors.primary }}
      />
     </TouchableOpacity>
    </View>

    {/* Quick Stats */}
    <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
     <View style={styles.statCard}>
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Total Spent</Text>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
       ${totalSpent.toFixed(2)}
      </Text>
     </View>
     <View style={styles.statCard}>
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Daily Average</Text>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
       ${averageDaily.toFixed(2)}
      </Text>
     </View>
     <View style={styles.statCard}>
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Largest</Text>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
       ${largestExpense.toFixed(2)}
      </Text>
     </View>
    </View>

    {/* Spending Chart */}
    <Card style={styles.sectionCard}>
     <Card.Title
      title="Spending by Category"
      titleVariant="titleMedium"
      right={(props) => (
       <TouchableOpacity onPress={() => navigation.navigate('MainReports')}>
        <Text style={{ color: theme.colors.primary, marginRight: 16 }}>See All</Text>
       </TouchableOpacity>
      )}
     />
     <Card.Content>
      <View style={styles.chartContainer}>
       <SpendingPieChart expenses={expenses} categories={categories} />
      </View>
     </Card.Content>
    </Card>

    {/* Trend Chart */}
    <Card style={styles.sectionCard}>
     <Card.Title title="Spending Trend" titleVariant="titleMedium" />
     <Card.Content>
      <View style={styles.chartContainer}>
       <TrendLineChart expenses={expenses} />
      </View>
     </Card.Content>
    </Card>

    {/* Recent Expenses */}
    <View style={styles.section}>
     <View style={styles.sectionHeader}>
      <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Recent Expenses</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
       <Text style={{ color: theme.colors.primary }}>View All</Text>
      </TouchableOpacity>
     </View>

     {recentExpenses.length > 0 ? (
      recentExpenses.map((expense) => (
       <ExpenseCard key={expense.id} expense={expense} />
      ))
     ) : (
      <View style={styles.emptyState}>
       <Ionicons name="receipt-outline" size={48} color={theme.colors.onSurfaceVariant} />
       <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 10 }}>
        No expenses yet
       </Text>
       <Button
        mode="contained"
        onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense' })}
        style={{ marginTop: 15 }}
       >
        Add Your First Expense
       </Button>
      </View>
     )}
    </View>

    {/* Quick Actions */}
    <View style={[styles.quickActions, { backgroundColor: theme.colors.surface }]}>
     <View style={styles.actionItem}>
      <IconButton
       icon="plus-circle"
       iconColor={theme.colors.primary}
       size={30}
       onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense' })}
      />
      <Text variant="labelSmall">Add Expense</Text>
     </View>
     <View style={styles.actionItem}>
      <IconButton
       icon="robot"
       iconColor={theme.colors.primary}
       size={30}
       onPress={() => navigation.navigate('AI Assistant')}
      />
      <Text variant="labelSmall">Ask AI</Text>
     </View>
     <View style={styles.actionItem}>
      <IconButton
       icon="chart-bar"
       iconColor={theme.colors.primary}
       size={30}
       onPress={() => navigation.navigate('Reports')}
      />
      <Text variant="labelSmall">Reports</Text>
     </View>
    </View>
   </ScrollView>
  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 15,
 },
 statsContainer: {
  flexDirection: 'row',
  paddingVertical: 20,
  marginTop: 1,
  elevation: 2,
 },
 statCard: {
  flex: 1,
  alignItems: 'center',
 },
 section: {
  marginTop: 20,
  paddingBottom: 20,
 },
 sectionCard: {
  marginHorizontal: 16,
  marginTop: 16,
  backgroundColor: 'white',
 },
 sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  marginBottom: 10,
 },
 chartContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200,
 },
 emptyState: {
  alignItems: 'center',
  padding: 30,
 },
 quickActions: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: 20,
  paddingVertical: 10,
  marginBottom: 40,
  elevation: 4,
 },
 actionItem: {
  alignItems: 'center',
 },
});

export default DashboardScreen;