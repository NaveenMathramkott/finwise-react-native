import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Dialog, Divider, FAB, Portal, ProgressBar, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useSnackbar } from '../../hooks/useSnackbar';
import { createBudget, editBudget, fetchBudgets, removeBudget } from '../../redux/slices/budgetSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';
import { CustomAlert } from '../../utils/AlertService';
import { ICONS, PRESET_COLORS } from '../../utils/constants';



const BudgetScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { budgets, loading } = useAppSelector((state: RootState) => state.budget);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [visible, setVisible] = React.useState(false);
  const [budgetName, setBudgetName] = React.useState('');
  const [selectedIcon, setSelectedIcon] = React.useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = React.useState(PRESET_COLORS[0]);
  const [amount, setAmount] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallProgress = totalBudget > 0 ? totalSpent / totalBudget : 0;

  React.useEffect(() => {
    if (user?.accountId) {
      dispatch(fetchBudgets(user.accountId));
    }
  }, [dispatch, user?.accountId]);

  const onRefresh = React.useCallback(async () => {
    if (user?.accountId) {
      setRefreshing(true);
      await dispatch(fetchBudgets(user.accountId));
      setRefreshing(false);
    }
  }, [dispatch, user?.accountId]);

  const showModal = (budget?: any) => {
    if (budget) {
      setEditingId(budget.id);
      setBudgetName(budget.name);
      setSelectedIcon(budget.icon || ICONS[0]);
      setSelectedColor(budget.color || PRESET_COLORS[0]);
      setAmount(Number(budget.limit).toString());
    } else {
      setEditingId(null);
      setBudgetName('');
      setSelectedIcon(ICONS[0]);
      setSelectedColor(PRESET_COLORS[0]);
      setAmount('');
    }
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const handleDeleteBudget = (id: string, name: string) => {
    CustomAlert.alert(
        'Delete Budget',
        'BUDGET',
        `Are you sure you want to delete the budget for ${name}?`,
        () => {
            dispatch(removeBudget(id));
            showSnackbar(`Budget deleted: ${name}`, 'success');
        }
    );
  };

  const handleSaveBudget = async () => {
    if (!budgetName.trim()) {
      showSnackbar('Please enter a budget name', 'error');
      return;
    }
    if (!amount || isNaN(parseFloat(amount))) {
      showSnackbar('Please enter a valid amount', 'error');
      return;
    }

    if (!user?.accountId) {
      showSnackbar('Error - User session missing', 'error');
      return;
    }
    
    // Calculate current spent for this budget (matching by name for now, or just setting to 0 if new)
    const { expenses } = require('../../redux/store').store.getState().expenses;
    // Assuming expenses.budgetId will store the Budget ID
    // If it's a new budget, spent is initially 0 or calculated by matching name (for migration)
    const spent = expenses
      .filter((e: any) => e.budgetId === editingId || e.budget === budgetName)
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    const budgetData = {
      name: budgetName,
      icon: selectedIcon,
      color: selectedColor,
      limit: parseFloat(amount),
      spent: spent,
      user: user.accountId,
    };

    try {
        if (editingId) {
            const result = await dispatch(editBudget({ id: editingId, ...budgetData }));
            if (editBudget.fulfilled.match(result)) {
                showSnackbar(`Budget updated successfully`, 'success');
            } else {
                showSnackbar('Error - ' + (result.payload as string), 'error');
            }
        } else {
            const result = await dispatch(createBudget(budgetData));
            if (createBudget.fulfilled.match(result)) {
                showSnackbar(`Budget created successfully`, 'success');
            } else {
                showSnackbar('Error - ' + (result.payload as string), 'error');
            }
        }
    } catch (error) {
        showSnackbar('Error - Failed to save budget', 'error');
    }

    hideModal();
  };

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
                    <Text variant="titleSmall" style={styles.statValue}>AED{totalSpent.toFixed(2)}</Text>
                </View>
                <Divider style={styles.verticalDivider} />
                <View style={{ alignItems: 'flex-end' }}>
                    <Text variant="labelSmall" style={styles.statLabel}>Limit</Text>
                    <Text variant="titleSmall" style={styles.statValue}>AED{totalBudget.toFixed(2)}</Text>
                </View>
            </View>
          </View>
        </Surface>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Budgets Overview</Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {budgets.length > 0 ? (
              budgets.map((budget, index) => {
                  const budgetName = budget.name;
                  const budgetIcon = budget.icon || 'help-circle';
                  const budgetColor = budget.color || theme.colors.primary;

                  const progress = budget.limit > 0 ? budget.spent / budget.limit : 0;
                  const isOver = progress > 1;

                   return (
                      <Animated.View key={budget.id} entering={FadeInDown.delay(300 + index * 100)}>
                          <TouchableOpacity 
                            onLongPress={() => handleDeleteBudget(budget.id, budget.name)}
                            onPress={() => showModal(budget)}
                            activeOpacity={0.7}
                          >
                            <Card style={styles.budgetCard}>
                                <Card.Content>
                                    <View style={styles.budgetHeader}>
                                        <View style={styles.catInfo}>
                                            <View style={[styles.iconBox, { backgroundColor: budgetColor + '15' }]}>
                                                <Ionicons name={budgetIcon as any} size={18} color={budgetColor} />
                                            </View>
                                            <Text variant="titleMedium" style={styles.catName}>{budgetName}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text variant="bodySmall" style={isOver ? { color: theme.colors.error, fontWeight: 'bold' } : { opacity: 0.6 }}>
                                                AED{budget.spent.toFixed(0)} / AED{budget.limit.toFixed(0)}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <ProgressBar 
                                        progress={Math.min(progress, 1)} 
                                        color={isOver ? theme.colors.error : budgetColor} 
                                        style={styles.budgetProgress} 
                                    />
                                    
                                    <View style={styles.budgetFooter}>
                                        <Text variant="labelSmall" style={{ opacity: 0.5 }}>
                                            {isOver ? 'Exceeded by' : 'Remaining'}
                                        </Text>
                                        <Text variant="labelSmall" style={{ fontWeight: 'bold', color: isOver ? theme.colors.error : '#4CAF50' }}>
                                            AED{Math.abs(budget.limit - budget.spent).toFixed(2)}
                                        </Text>
                                    </View>
                                </Card.Content>
                            </Card>
                          </TouchableOpacity>
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

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={showModal}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideModal} style={{ borderRadius: 24, backgroundColor: theme.colors.surface }}>
          <Dialog.Title style={{ fontWeight: 'bold' }}>{editingId ? 'Edit Budget' : 'Create New Budget'}</Dialog.Title>
          <Dialog.Content>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <TextInput
                label="Budget Name"
                mode="outlined"
                value={budgetName}
                onChangeText={setBudgetName}
                style={[styles.input, { marginBottom: 12 }]}
                outlineStyle={{ borderRadius: 16 }}
                placeholder="e.g. Shopping, Rent"
              />

              <TextInput
                label="Monthly Limit"
                mode="outlined"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
                outlineStyle={{ borderRadius: 16 }}
                left={<TextInput.Affix text="AED" />}
              />

              <View style={styles.pickerSection}>
                <Text variant="labelLarge" style={styles.pickerLabel}>Select Icon</Text>
                <View style={styles.iconGrid}>
                  {ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      onPress={() => setSelectedIcon(icon)}
                      style={[
                        styles.iconOption,
                        { backgroundColor: selectedIcon === icon ? selectedColor + '20' : 'transparent' },
                        selectedIcon === icon && { borderColor: selectedColor, borderWidth: 2 }
                      ]}
                    >
                      <Ionicons name={icon as any} size={24} color={selectedIcon === icon ? selectedColor : theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.pickerSection}>
                <Text variant="labelLarge" style={styles.pickerLabel}>Select Color</Text>
                <View style={styles.colorGrid}>
                  {PRESET_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && { borderColor: theme.colors.onSurface, borderWidth: 3 }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Button onPress={hideModal} textColor={theme.colors.onSurfaceVariant}>Cancel</Button>
            <Button mode="contained" onPress={handleSaveBudget} style={{ borderRadius: 12 }}>Save Budget</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  budgetProgress: {
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 8,
    bottom: 8,
    borderRadius: 20,
  },
  pickerSection: {
    marginVertical: 4,
  },
  pickerLabel: {
      marginLeft: 4,
      marginBottom: 8,
      fontWeight: 'bold',
      opacity: 0.6,
  },
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  pickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'transparent',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 4,
  },
});

export default BudgetScreen;
