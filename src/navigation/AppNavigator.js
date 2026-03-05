import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AddExpenseScreen from '../screens/main/AddExpenseScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="AddExpense" 
            component={AddExpenseScreen} 
            options={{ presentation: 'modal', headerShown: true, title: 'Add Expense' }} 
          />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
