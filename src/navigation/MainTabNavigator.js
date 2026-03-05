import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIAssistantScreen from '../screens/main/AIAssistantScreen';
import BudgetScreen from '../screens/main/BudgetScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import ExpensesScreen from '../screens/main/ExpensesScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          else if (route.name === 'Expenses') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'AI Assistant') iconName = focused ? 'robot' : 'robot-outline';
          else if (route.name === 'Budget') iconName = focused ? 'chart-arc' : 'chart-arc';
          else if (route.name === 'Settings') iconName = focused ? 'cog' : 'cog-outline';

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
