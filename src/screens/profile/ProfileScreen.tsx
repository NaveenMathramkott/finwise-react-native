import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
 Avatar,
 Button,
 Card,
 Divider,
 Surface,
 Switch,
 Text,
 useTheme
} from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { logout, logoutUser } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/uiSlice';
import { CustomAlert } from '../../utils/AlertService';

const ProfileScreen = ({ navigation }: any) => {
 const theme = useTheme();
 const dispatch = useAppDispatch();
 const { user } = useAppSelector((state) => state.auth);
 const currentTheme = useAppSelector((state) => state.ui.theme);

 const isDarkMode = currentTheme === 'dark';

 const onToggleTheme = () => {
  dispatch(toggleTheme());
 };

  const handleLogout = () => {
    CustomAlert.show({
      title: 'Logout',
      subtitle: 'Confirmation',
      message: 'Are you sure you want to log out of your account?',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
             const resultAction = await dispatch(logoutUser());
             if (logoutUser.fulfilled.match(resultAction)) {
               dispatch(logout());
             } else {
               const errorMsg = resultAction.payload as string || 'Failed to sign out from server.';
               CustomAlert.show({
                 title: 'Logout Error',
                 message: errorMsg,
                 buttons: [{ text: 'OK' }]
               });
               // Still logout locally as a fallback
               dispatch(logout());
             }
          },
        },
      ],
    });
  };

 const ProfileOption = ({ icon, title, subtitle, onPress, right, color }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
   <Surface style={[styles.optionItem, { backgroundColor: theme.colors.surface }]} elevation={0}>
    <View style={[styles.optionIconContainer, { backgroundColor: (color || theme.colors.primary) + '15' }]}>
     <Ionicons name={icon} size={22} color={color || theme.colors.primary} />
    </View>
    <View style={styles.optionTextContainer}>
     <Text variant="titleMedium" style={styles.optionTitle}>{title}</Text>
     {subtitle && <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{subtitle}</Text>}
    </View>
    {right ? right() : <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
   </Surface>
  </TouchableOpacity>
 );

 return (
  <ScrollView
   style={[styles.container, { backgroundColor: theme.colors.background }]}
   showsVerticalScrollIndicator={false}
  >
   {/* Top Background Pattern */}
   <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

   <Animated.View entering={FadeInUp.duration(600)} style={styles.headerContainer}>
    <Surface style={[styles.profileCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
     <View style={styles.avatarWrapper}>
      <Avatar.Text
       size={100}
       label={user?.name?.charAt(0) || 'U'}
       style={{ backgroundColor: theme.colors.primary }}
      />
      <TouchableOpacity
       style={[styles.editBadge, { backgroundColor: theme.colors.secondary }]}
       onPress={() => navigation.navigate('EditProfile')}
      >
       <Ionicons name="camera" size={20} color="white" />
      </TouchableOpacity>
     </View>

     <Text variant="headlineSmall" style={styles.userName}>{user?.name || 'User'}</Text>
     <Text variant="bodyMedium" style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

     <View style={styles.statsRow}>
      <View style={styles.statItem}>
       <Text variant="titleLarge" style={styles.statValue}>12</Text>
       <Text variant="labelSmall" style={styles.statLabel}>Goals</Text>
      </View>
      <Divider style={styles.statDivider} />
      <View style={styles.statItem}>
       <Text variant="titleLarge" style={styles.statValue}>85%</Text>
       <Text variant="labelSmall" style={styles.statLabel}>Accuracy</Text>
      </View>
      <Divider style={styles.statDivider} />
      <View style={styles.statItem}>
       <Text variant="titleLarge" style={styles.statValue}>Pro</Text>
       <Text variant="labelSmall" style={styles.statLabel}>Level</Text>
      </View>
     </View>
    </Surface>
   </Animated.View>

   <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.content}>
    <Text variant="titleMedium" style={styles.sectionLabel}>Account Settings</Text>
    <Card style={styles.optionsCard}>
     <ProfileOption
      icon="person-outline"
      title="Edit Profile"
      subtitle="Change your personal info"
      onPress={() => navigation.navigate('EditProfile')}
     />
     <Divider style={styles.divider} />
     <ProfileOption
      icon="lock-closed-outline"
      title="Security"
      subtitle="Change password & auth"
      onPress={() => navigation.navigate('ChangePassword')}
     />
     <Divider style={styles.divider} />
     <ProfileOption
      icon="moon-outline"
      title="Dark Mode"
      subtitle="Toggle app appearance"
      onPress={onToggleTheme}
      right={() => (
       <Switch value={isDarkMode} onValueChange={onToggleTheme} color={theme.colors.primary} />
      )}
     />
    </Card>

    <Text variant="titleMedium" style={[styles.sectionLabel, { marginTop: 24 }]}>Preferences</Text>
    <Card style={styles.optionsCard}>
     <ProfileOption
      icon="notifications-outline"
      title="Notifications"
      subtitle="Manage alerts & sounds"
      onPress={() => { }}
     />
     <Divider style={styles.divider} />
     <ProfileOption
      icon="language-outline"
      title="Language"
      subtitle="English (United States)"
      onPress={() => { }}
     />
    </Card>

    <Text variant="titleMedium" style={[styles.sectionLabel, { marginTop: 24 }]}>More</Text>
    <Card style={styles.optionsCard}>
     <ProfileOption
      icon="help-buoy-outline"
      title="Support"
      onPress={() => navigation.navigate('Support')}
     />
     <Divider style={styles.divider} />
     <ProfileOption
      icon="information-circle-outline"
      title="About FinWise"
      onPress={() => navigation.navigate('About')}
     />
    </Card>

    <Button
     mode="contained"
     onPress={handleLogout}
     style={styles.logoutButton}
     contentStyle={styles.logoutButtonContent}
     buttonColor={theme.colors.error}
    >
     Logout Account
    </Button>

    <Text variant="bodySmall" style={styles.versionText}>Version 1.2.0 • Build 2026</Text>
   </Animated.View>
  </ScrollView>
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
 headerContainer: {
  marginTop: 100,
  paddingHorizontal: 20,
  alignItems: 'center',
 },
 profileCard: {
  width: '100%',
  borderRadius: 32,
  padding: 24,
  alignItems: 'center',
 },
 avatarWrapper: {
  marginTop: -70,
  position: 'relative',
  marginBottom: 16,
  elevation: 8,
  borderRadius: 50,
  backgroundColor: 'white',
  padding: 4,
 },
 editBadge: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: 'white',
 },
 userName: {
  fontWeight: 'bold',
  fontSize: 24,
 },
 userEmail: {
  opacity: 0.6,
  marginBottom: 24,
 },
 statsRow: {
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderTopWidth: 1,
  borderTopColor: 'rgba(0,0,0,0.05)',
  paddingTop: 20,
 },
 statItem: {
  alignItems: 'center',
 },
 statValue: {
  fontWeight: 'bold',
 },
 statLabel: {
  opacity: 0.5,
  textTransform: 'uppercase',
  letterSpacing: 1,
 },
 statDivider: {
  height: 30,
  width: 1,
 },
 content: {
  padding: 20,
 },
 sectionLabel: {
  fontWeight: 'bold',
  marginBottom: 12,
  marginLeft: 4,
  opacity: 0.8,
 },
 optionsCard: {
  borderRadius: 24,
  overflow: 'hidden',
  backgroundColor: 'white',
  elevation: 2,
 },
 optionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
 },
 optionIconContainer: {
  width: 44,
  height: 44,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 16,
 },
 optionTextContainer: {
  flex: 1,
 },
 optionTitle: {
  fontWeight: '600',
 },
 divider: {
  marginHorizontal: 16,
  opacity: 0.5,
 },
 logoutButton: {
  marginTop: 32,
  borderRadius: 20,
  elevation: 4,
 },
 logoutButtonContent: {
  paddingVertical: 8,
 },
 versionText: {
  textAlign: 'center',
  marginTop: 24,
  marginBottom: 40,
  opacity: 0.4,
 }
});

export default ProfileScreen;
