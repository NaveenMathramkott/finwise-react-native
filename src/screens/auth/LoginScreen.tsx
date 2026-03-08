import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text as PaperText, Surface, TextInput, useTheme } from "react-native-paper";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '../../hooks/useSnackbar';
import { setUser } from '../../redux/slices/authSlice';

const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      setTimeout(() => {
        dispatch(
          setUser({
            id: '1',
            email: data.email,
            name: 'John Doe',
          })
        );
        showSnackbar('Success - Welcome back!', 'success');
        setLoading(false);
      }, 1000);
    } catch (error) {
      showSnackbar('Error - Login error', 'error');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
            <Surface style={styles.logoContainer} elevation={4}>
               <Ionicons name="wallet" size={60} color={theme.colors.primary} />
            </Surface>
            <PaperText variant="displaySmall" style={[styles.title, { color: 'white' }]}>Welcome Back!</PaperText>
            <PaperText variant="bodyLarge" style={{ color: 'rgba(255,255,255,0.8)' }}>Sign in to continue</PaperText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(800).delay(300)}>
            <Surface style={[styles.formCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
              <View style={styles.formContent}>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Email"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={!!errors.email}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="mail-outline" size={22} color={theme.colors.primary} />} />}
                      style={styles.input}
                    />
                  )}
                />
                {errors.email && <HelperText type="error" visible={true}>{errors.email.message as string}</HelperText>}

                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Password"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      error={!!errors.password}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="lock-closed-outline" size={22} color={theme.colors.primary} />} />}
                      right={
                        <TextInput.Icon
                          icon={() => <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.colors.primary} />}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                      style={styles.input}
                    />
                  )}
                />
                {errors.password && <HelperText type="error" visible={true}>{errors.password.message as string}</HelperText>}

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={styles.forgotPassword}
                >
                  <PaperText style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot Password?</PaperText>
                </TouchableOpacity>

                <Button
                  onPress={handleSubmit(onSubmit)}
                  mode="contained"
                  loading={loading}
                  disabled={loading}
                  style={styles.loginButton}
                  contentStyle={{ paddingVertical: 8 }}
                >
                  Sign In
                </Button>
                
                <View style={styles.footer}>
                  <PaperText style={{ color: theme.colors.onSurfaceVariant }}>Don't have an account? </PaperText>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <PaperText style={[styles.signUpText, { color: theme.colors.primary }]}>Sign Up</PaperText>
                  </TouchableOpacity>
                </View>
              </View>
            </Surface>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
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
    height: '45%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formCard: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  formContent: {
    padding: 24,
  },
  input: {
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 16,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;