import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Avatar,
    Button,
    Divider,
    List,
    Surface,
    Switch,
    Text,
    useTheme
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/uiSlice';
import { RootState } from '../../redux/store';

const ProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const currentTheme = useSelector((state: RootState) => state.ui.theme);

  const isDarkMode = currentTheme === 'dark';

  const onToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.charAt(0) || 'U'} 
          style={{ backgroundColor: theme.colors.primary }}
        />
        <Text variant="headlineSmall" style={styles.userName}>{user?.name || 'User'}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{user?.email || 'user@example.com'}</Text>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('EditProfile')} 
          style={styles.editButton}
        >
          Edit Profile
        </Button>
      </Surface>

      <View style={styles.section}>
        <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Settings</Text>
        <List.Item
          title="Dark Mode"
          left={props => <List.Icon {...props} icon="weather-night" />}
          right={() => (
            <Switch value={isDarkMode} onValueChange={onToggleTheme} color={theme.colors.primary} />
          )}
        />
        <Divider />
        <List.Item
          title="Change Password"
          left={props => <List.Icon {...props} icon="lock-outline" />}
          onPress={() => navigation.navigate('ChangePassword')}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </View>

      <View style={styles.section}>
        <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Support</Text>
        <List.Item
          title="Help Center"
          left={props => <List.Icon {...props} icon="help-circle-outline" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          left={props => <List.Icon {...props} icon="shield-check-outline" />}
          onPress={() => {}}
        />
      </View>

      <View style={styles.logoutSection}>
        <Button 
          mode="contained" 
          onPress={handleLogout} 
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userName: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  editButton: {
    marginTop: 15,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    marginLeft: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  logoutSection: {
    marginTop: 40,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logoutButton: {
    borderRadius: 8,
  },
});

export default ProfileScreen;
