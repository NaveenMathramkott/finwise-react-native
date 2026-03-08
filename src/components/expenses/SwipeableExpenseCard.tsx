import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useTheme } from 'react-native-paper';
import Reanimated, {
 Extrapolation,
 interpolate,
 SharedValue,
 useAnimatedStyle
} from 'react-native-reanimated';
import ExpenseCard from './ExpenseCard';

interface SwipeableExpenseCardProps {
  expense: any;
  onDelete: (id: string) => void;
  onEdit: (expense: any) => void;
  onSwipeableWillOpen: (ref: any) => void;
}

const RightActions = ({ 
  dragX, 
  expense, 
  onDelete, 
  onEdit, 
  theme 
}: { 
  dragX: SharedValue<number>, 
  expense: any, 
  onDelete: (id: string) => void, 
  onEdit: (expense: any) => void,
  theme: any
}) => {
  const actionWrapperStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      dragX.value,
      [-160, 0],
      [0, 160],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={styles.rightActionsContainer}>
      <Reanimated.View style={[styles.actionWrapper, actionWrapperStyle]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => onEdit(expense)}
        >
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => onDelete(expense.id)}
        >
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      </Reanimated.View>
    </View>
  );
};

const SwipeableExpenseCard = React.forwardRef<any, SwipeableExpenseCardProps>(
  ({ expense, onDelete, onEdit, onSwipeableWillOpen }, ref) => {
    const theme = useTheme();
    const swipeableRef = React.useRef<any>(null);

    React.useImperativeHandle(ref, () => swipeableRef.current);

    const renderRightActions = (
      _progress: SharedValue<number>,
      dragX: SharedValue<number>
    ) => (
      <RightActions 
        dragX={dragX} 
        expense={expense} 
        onDelete={onDelete} 
        onEdit={onEdit} 
        theme={theme}
      />
    );

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={() => onSwipeableWillOpen(swipeableRef.current)}
        friction={2}
        rightThreshold={40}
        activeOffsetX={[-20, 20]}
        failOffsetY={[-20, 20]}
        shouldCancelWhenOutside={true}
      >
        <ExpenseCard expense={expense} />
      </Swipeable>
    );
  }
);

const styles = StyleSheet.create({
  rightActionsContainer: {
    width: 160,
    flexDirection: 'row',
  },
  actionWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    paddingVertical: 6,
    paddingRight: 16,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
  },
});

export default SwipeableExpenseCard;
