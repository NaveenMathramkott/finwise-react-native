import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddExpenseScreen from '../screens/expense/AddExpenseScreen';
import AIAssistantScreen from '../screens/main/AIAssistantScreen';
import BudgetScreen from '../screens/main/BudgetScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import ExpensesScreen from '../screens/main/ExpensesScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
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
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

// Reports Stack
const ReportsStack = () => (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="Reports" component={ReportsScreen} />
    <Stack.Screen name="Budget" component={BudgetScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
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
          } else if (route.name === 'MainReports') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'MainProfile') {
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
      <Tab.Screen name="MainReports" component={ReportsStack} />
      <Tab.Screen name="MainProfile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
