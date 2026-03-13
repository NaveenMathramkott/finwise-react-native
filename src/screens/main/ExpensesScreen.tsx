import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Chip, FAB, Searchbar, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import SwipeableExpenseCard from '../../components/expenses/SwipeableExpenseCard';
import { fetchExpenses, removeExpense } from '../../redux/slices/expensesSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';
import { CustomAlert } from '../../utils/AlertService';

const PAGE_SIZE = 10;

const ExpensesScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { expenses, loading } = useAppSelector((state: RootState) => state.expenses);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [displayedExpenses, setDisplayedExpenses] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  const currentOpenSwipeable = useRef<any>(null);

  const closeOpenSwipeable = () => {
    if (currentOpenSwipeable.current?.close) {
      currentOpenSwipeable.current.close();
      currentOpenSwipeable.current = null;
    }
  };

  const totalThisMonth = expenses.reduce((sum, exp) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    if (expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()) {
        return sum + exp.amount;
    }
    return sum;
  }, 0);

  useEffect(() => {
    if (user?.accountId) {
      dispatch(fetchExpenses(user.accountId));
    }
  }, [dispatch, user?.accountId]);

  // Initial load, search filtering and sorting
  useEffect(() => {
    closeOpenSwipeable();
    let filtered = expenses.filter(exp => 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting logic
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }

    setDisplayedExpenses(filtered.slice(0, PAGE_SIZE));
    setPage(1);
  }, [expenses, searchQuery, sortBy]);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    
    let filtered = expenses.filter(exp => 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply same sorting
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }

    if (displayedExpenses.length >= filtered.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const nextExpenses = filtered.slice(0, nextPage * PAGE_SIZE);
      setDisplayedExpenses(nextExpenses);
      setPage(nextPage);
      setLoadingMore(false);
    }, 1000);
  }, [displayedExpenses, expenses, page, loadingMore, searchQuery, sortBy]);

  const handleDelete = (id: string) => {
    closeOpenSwipeable();
    CustomAlert.alert(
      'Delete Expense',
      'EXPENSE',
      'Are you sure you want to delete this expense permanent?',
      () => dispatch(removeExpense(id))
    );
  };

  const handleEdit = (expense: any) => {
    closeOpenSwipeable();
    navigation.navigate('AddExpense', { expense });
  };

  const onSwipeableWillOpen = (ref: any) => {
    if (currentOpenSwipeable.current && currentOpenSwipeable.current !== ref) {
      currentOpenSwipeable.current.close?.();
    }
    currentOpenSwipeable.current = ref;
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Primary Background */}
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <View style={styles.titleRow}>
            <View>
                <Text variant="headlineMedium" style={styles.screenTitle}>My Expenses</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {/* Monthly Spending: <Text variant="labelLarge" style={{ color: theme.colors.primary }}>AED{totalThisMonth.toFixed(2)}</Text> */}
                </Text>
            </View>
            <TouchableOpacity 
              onPress={() => {
                closeOpenSwipeable();
                navigation.navigate('Budget');
              }}
              style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}
            >
                <Ionicons name="storefront-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <Searchbar
            placeholder="Search transactions..."
            onChangeText={(text) => {
              closeOpenSwipeable();
              setSearchQuery(text);
            }}
            onFocus={closeOpenSwipeable}
            value={searchQuery}
            style={styles.searchBar}
            elevation={0}
          />

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterRowContent}
          >
            {[
                { label: 'Latest', value: 'latest', icon: 'time-outline' },
                { label: 'Highest', value: 'highest', icon: 'trending-up-outline' },
                { label: 'Lowest', value: 'lowest', icon: 'trending-down-outline' },
                { label: 'Oldest', value: 'oldest', icon: 'calendar-outline' }
            ].map((item) => (
                <Chip 
                  key={item.value}
                  selected={sortBy === item.value} 
                  onPress={() => {
                    closeOpenSwipeable();
                    setSortBy(item.value);
                  }}
                  style={[styles.chip, sortBy === item.value && { backgroundColor: theme.colors.primary }]}
                  textStyle={sortBy === item.value && { color: 'white' }}
                  showSelectedOverlay
                  icon={({ color }) => (
                    <Ionicons name={item.icon as any} size={14} color={sortBy === item.value ? 'white' : color} />
                  )}
                >
                  {item.label}
                </Chip>
            ))}
          </ScrollView>
        </Surface>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ flex: 1 }}>
        <FlatList
          data={displayedExpenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => {
            closeOpenSwipeable();
            Keyboard.dismiss();
          }}
          onTouchStart={closeOpenSwipeable}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(300 + index * 50)}>
                <SwipeableExpenseCard 
                  expense={item} 
                  onDelete={handleDelete} 
                  onEdit={handleEdit} 
                  onSwipeableWillOpen={(ref) => onSwipeableWillOpen(ref)}
                />
            </Animated.View>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
                No records found
              </Text>
            </View>
          }
        />
      </Animated.View>

      <FAB
        icon="plus"
        // label=""
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={() => {
          closeOpenSwipeable();
          navigation.navigate('AddExpense');
        }}
      />
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
    height: 180,
  },
  headerWrapper: {
    marginTop: 60,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerCard: {
    borderRadius: 32,
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginBottom: 16,
    height: 48,
  },
  filterRowContent: {
    gap: 8,
    paddingRight: 10,
  },
  chip: {
    borderRadius: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    opacity: 0.5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 8,
    bottom: 8,
    borderRadius: 20,
  },
});

export default ExpensesScreen;
