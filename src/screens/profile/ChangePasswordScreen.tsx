import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, HelperText, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSnackbar } from '../../hooks/useSnackbar';

const ChangePasswordScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      showSnackbar('Password Updated - Your password has been changed successfully.', 'success');
      setLoading(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <Text variant="headlineSmall" style={styles.screenTitle}>Change Password</Text>
            <View style={{ width: 40 }} />
          </View>
        </Surface>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Surface style={[styles.formCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <View style={styles.formContent}>
                <Controller
                  control={control}
                  name="oldPassword"
                  rules={{ required: 'Current password is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Current Password"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.oldPassword}
                      style={styles.input}
                      secureTextEntry={!showOldPassword}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="lock-closed-outline" size={20} color={theme.colors.primary} />} />}
                      right={
                        <TextInput.Icon
                          icon={() => <Ionicons name={showOldPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.primary} />}
                          onPress={() => setShowOldPassword(!showOldPassword)}
                        />
                      }
                    />
                  )}
                />
                {errors.oldPassword && <HelperText type="error" visible={true}>{errors.oldPassword.message as string}</HelperText>}

                <Controller
                  control={control}
                  name="newPassword"
                  rules={{
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="New Password"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.newPassword}
                      style={styles.input}
                      secureTextEntry={!showNewPassword}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="key-outline" size={20} color={theme.colors.secondary} />} />}
                      right={
                        <TextInput.Icon
                          icon={() => <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.primary} />}
                          onPress={() => setShowNewPassword(!showNewPassword)}
                        />
                      }
                    />
                  )}
                />
                {errors.newPassword && <HelperText type="error" visible={true}>{errors.newPassword.message as string}</HelperText>}

                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: 'Please confirm your new password',
                    validate: value => value === newPassword || 'Passwords do not match',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Confirm New Password"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.confirmPassword}
                      style={styles.input}
                      secureTextEntry={!showConfirmPassword}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.secondary} />} />}
                      right={
                        <TextInput.Icon
                          icon={() => <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.primary} />}
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      }
                    />
                  )}
                />
                {errors.confirmPassword && <HelperText type="error" visible={true}>{errors.confirmPassword.message as string}</HelperText>}

                <Button
                  mode="contained"
                  loading={loading}
                  disabled={loading}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.submitBtn}
                  contentStyle={styles.submitBtnContent}
                >
                  Update Password
                </Button>
              </View>
            </Surface>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginTop: 30,
  },
  formCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  formContent: {
    padding: 24,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 16,
  },
  submitBtnContent: {
    paddingVertical: 8,
  },
});

export default ChangePasswordScreen;
