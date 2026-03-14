import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Divider, Modal, Portal, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Budget {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  budgetId: string;
  date: string;
  image?: string;
}

interface TransactionDetailSheetProps {
  visible: boolean;
  onDismiss: () => void;
  expense: Expense | null;
  budgets: Budget[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const TransactionDetailSheet = ({
  visible,
  onDismiss,
  expense,
  budgets,
  onEdit,
  onDelete,
}: TransactionDetailSheetProps) => {
  const theme = useTheme();

  if (!expense) return null;

  const currentBudget = budgets.find((b) => b.id === expense.budgetId);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
      >
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.shutterContainer}>
            <View style={styles.dragIndicator} />

            <View style={styles.modalHeader}>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                {expense.title}
              </Text>
              <Text variant="displaySmall" style={[styles.modalAmount, { color: theme.colors.error }]}>
                AED {Number(expense.amount).toFixed(2)}
              </Text>
            </View>

            <Divider style={styles.modalDivider} />

            <View style={styles.infoRow}>
              <DetailItem
                icon="grid-outline"
                label="Budget"
                value={currentBudget?.name || 'Uncategorized'}
                color={currentBudget?.color}
              />
              <DetailItem
                icon="calendar-outline"
                label="Date"
                value={expense.date.split('T')[0]}
              />
            </View>

            {expense.image && (
              <View style={styles.imageContainer}>
                <Text variant="labelLarge" style={styles.label}>
                  Receipt Image
                </Text>
                <Image source={{ uri: expense.image }} style={styles.receiptImage} />
              </View>
            )}

            <View style={styles.actionRow}>
              <Button
                mode="contained"
                onPress={() => onEdit(expense)}
                style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
                icon="pencil"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => onDelete(expense.id)}
                style={styles.actionBtn}
                textColor={theme.colors.error}
                icon="trash-can"
              >
                Delete
              </Button>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </Portal>
  );
};

const DetailItem = ({ icon, label, value, color }: any) => {
  const theme = useTheme();
  return (
    <View style={styles.detailItem}>
      <View style={[styles.modalIconBox, { backgroundColor: (color || theme.colors.primary) + '15' }]}>
        <Ionicons name={icon} size={20} color={color || theme.colors.primary} />
      </View>
      <View>
        <Text variant="labelSmall" style={styles.modalLabel}>
          {label}
        </Text>
        <Text variant="titleMedium" style={styles.modalValue}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
  },
  shutterContainer: {
    alignItems: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginBottom: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalAmount: {
    fontWeight: '900',
  },
  modalDivider: {
    width: '100%',
    marginBottom: 20,
    opacity: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalLabel: {
    opacity: 0.5,
  },
  modalValue: {
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 16,
  },
});

export default TransactionDetailSheet;
