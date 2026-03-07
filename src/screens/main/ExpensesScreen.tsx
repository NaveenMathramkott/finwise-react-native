import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Chip, FAB, Searchbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableExpenseCard from '../../components/expenses/SwipeableExpenseCard';
import { deleteExpense } from '../../redux/slices/expensesSlice';
import { RootState } from '../../redux/store';

const PAGE_SIZE = 10;

const ExpensesScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { expenses } = useSelector((state: RootState) => state.expenses);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedExpenses, setDisplayedExpenses] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  const currentOpenSwipeable = useRef<any>(null);

  const closeOpenSwipeable = () => {
    if (currentOpenSwipeable.current) {
      currentOpenSwipeable.current.close();
      currentOpenSwipeable.current = null;
    }
  };

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

    // Apply same sorting to filtered list before slicing for loadMore
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
    // Simulate API delay
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
    dispatch(deleteExpense(id));
  };

  const handleEdit = (expense: any) => {
    closeOpenSwipeable();
    navigation.navigate('AddExpense', { expense });
  };

  const onSwipeableWillOpen = (ref: any) => {
    if (currentOpenSwipeable.current && currentOpenSwipeable.current !== ref) {
      currentOpenSwipeable.current.close();
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.screenTitle}>Expenses</Text>
          <Searchbar
            placeholder="Search expenses..."
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
            style={styles.filterRow}
            contentContainerStyle={styles.filterRowContent}
          >
            <Chip 
              selected={sortBy === 'latest'} 
              onPress={() => {
                closeOpenSwipeable();
                setSortBy('latest');
              }}
              style={styles.chip}
              showSelectedOverlay
            >
              Latest
            </Chip>
            <Chip 
              selected={sortBy === 'highest'} 
              onPress={() => {
                closeOpenSwipeable();
                setSortBy('highest');
              }}
              style={styles.chip}
              showSelectedOverlay
            >
              Highest
            </Chip>
            <Chip 
              selected={sortBy === 'lowest'} 
              onPress={() => {
                closeOpenSwipeable();
                setSortBy('lowest');
              }}
              style={styles.chip}
              showSelectedOverlay
            >
              Lowest
            </Chip>
            <Chip 
              selected={sortBy === 'oldest'} 
              onPress={() => {
                closeOpenSwipeable();
                setSortBy('oldest');
              }}
              style={styles.chip}
              showSelectedOverlay
            >
              Oldest
            </Chip>
          </ScrollView>
        </View>

        <FlatList
          data={displayedExpenses}
          keyExtractor={(item) => item.id}
          onScrollBeginDrag={() => {
            closeOpenSwipeable();
            Keyboard.dismiss();
          }}
          onTouchStart={closeOpenSwipeable}
          renderItem={({ item }) => {
            let swipeContext: any = null;
            return (
              <SwipeableExpenseCard 
                ref={(ref) => { swipeContext = ref; }}
                expense={item} 
                onDelete={handleDelete} 
                onEdit={handleEdit} 
                onSwipeableWillOpen={() => {
                  if (swipeContext) onSwipeableWillOpen(swipeContext);
                }}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
                No expenses found
              </Text>
            </View>
          }
        />
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={() => {
          closeOpenSwipeable();
          navigation.navigate('AddExpense');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 12,
  },
  filterRow: {
    flexGrow: 0,
  },
  filterRowContent: {
    paddingRight: 16,
    gap: 8,
  },
  chip: {
    borderRadius: 20,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
});

export default ExpensesScreen;
