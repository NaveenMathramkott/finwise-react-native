import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { fetchCategories } from '../redux/slices/expensesSlice';
import { useAppDispatch } from '../redux/store';
import AddExpenseScreen from '../screens/expense/AddExpenseScreen';
import BudgetScreen from '../screens/expense/BudgetScreen';
import AIAssistantScreen from '../screens/main/AIAssistantScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import ExpensesScreen from '../screens/main/ExpensesScreen';
import ReportsScreen from '../screens/main/ReportsScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import { COLORS } from '../utils/theme';
import {
 MainTabParamList
} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

// Expenses Stack
const ExpensesStack = () => (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="ExpensesList" component={ExpensesScreen} options={{ title: 'Expenses' }} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
    <Stack.Screen name="Budget" component={BudgetScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="CurrentProfile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Navigator>
);

// Reports Stack
const ReportsStack = () => (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="CurrentReports" component={ReportsScreen} />
    <Stack.Screen name="Budget" component={BudgetScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'AI Assistant') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Expenses" component={ExpensesStack} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Reports" component={ReportsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
