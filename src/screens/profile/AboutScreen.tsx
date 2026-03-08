import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const AboutScreen = ({ navigation }: any) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <Text variant="headlineSmall" style={styles.screenTitle}>About FinWise</Text>
            <View style={{ width: 40 }} />
          </View>
        </Surface>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={styles.logoContainer}>
            <Surface style={styles.logoBackground} elevation={2}>
              {/* Replace with actual logo image if available, using an icon as fallback */}
              {/* <Image source={require('../../../assets/icon.png')} style={styles.logo} /> */}
              <Ionicons name="wallet" size={60} color={theme.colors.primary} />
            </Surface>
            <Text variant="headlineMedium" style={styles.appName}>FinWise</Text>
            <Text variant="bodyMedium" style={styles.appVersion}>Version 1.0.0</Text>
            <Text variant="bodySmall" style={styles.appDescription}>
              Your smart personal finance companion. Track expenses, set budgets, and achieve financial goals with AI.
            </Text>
          </View>

          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <List.Section style={styles.listSection}>
              <List.Item
                title="Terms of Service"
                titleStyle={styles.listTitle}
                left={props => <Ionicons {...props} name="document-text-outline" size={24} color={theme.colors.primary} style={styles.listIcon} />}
                right={props => <Ionicons {...props} name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                style={styles.listItem}
              />
              <List.Item
                title="Privacy Policy"
                titleStyle={styles.listTitle}
                left={props => <Ionicons {...props} name="shield-checkmark-outline" size={24} color={theme.colors.secondary} style={styles.listIcon} />}
                right={props => <Ionicons {...props} name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                style={styles.listItem}
              />
              <List.Item
                title="Open Source Licenses"
                titleStyle={styles.listTitle}
                left={props => <Ionicons {...props} name="code-slash-outline" size={24} color={theme.colors.tertiary || '#4CAF50'} style={styles.listIcon} />}
                right={props => <Ionicons {...props} name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                style={styles.listItem}
              />
            </List.Section>
          </Surface>

          <View style={styles.footer}>
            <Text variant="labelSmall" style={styles.footerText}>
              © 2026 FinWise Inc. All rights reserved.
            </Text>
            <Text variant="labelSmall" style={styles.footerText}>
              Made with ❤️
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
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
    height: 180,
  },
  headerWrapper: {
    marginTop: 60,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerCard: {
    borderRadius: 32,
    padding: 16,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
  },
  screenTitle: {
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    opacity: 0.6,
    marginBottom: 16,
  },
  appDescription: {
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.7,
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  listSection: {
    margin: 0,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  listIcon: {
    marginRight: 12,
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.5,
  },
  footerText: {
    marginBottom: 4,
  },
});

export default AboutScreen;
