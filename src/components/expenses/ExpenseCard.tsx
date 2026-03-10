import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Text, useTheme } from 'react-native-paper';

interface ExpenseCardProps {
  expense: {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    image?: string;
  };
  paddingHoz?: number;
}

const categoryIcons: { [key: string]: string } = {
  Food: 'fast-food',
  Transport: 'car',
  Shopping: 'cart',
  Entertainment: 'film',
  Bills: 'document-text',
  Healthcare: 'medical',
  Education: 'school',
  Other: 'ellipsis-horizontal',
};

const ExpenseCard = ({ expense, paddingHoz=22 }: ExpenseCardProps) => {
  const theme = useTheme();
  const iconName = categoryIcons[expense.category] || 'receipt';

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface, marginHorizontal: paddingHoz }]} elevation={1}>
      <View style={styles.container}>
        {expense.image ? (
          <Avatar.Image
            size={40}
            source={{ uri: expense.image }}
          />
        ) : (
          <Avatar.Icon 
            size={40} 
            icon={({ size, color }) => <Ionicons name={iconName as any} size={size - 10} color={color} />} 
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.primary}
          />
        )}
        <View style={styles.details}>
          <Text variant="titleMedium" style={{ fontWeight: '600' }}>{expense.title}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{expense.category} • {expense.date}</Text>
        </View>
        <Text variant="titleMedium" style={[styles.amount, { color: theme.colors.error }]}>
          AED {expense.amount.toFixed(2)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
 
  card: {
    marginVertical: 6,
    borderRadius: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  amount: {
    fontWeight: 'bold',
  },
});

export default ExpenseCard;
