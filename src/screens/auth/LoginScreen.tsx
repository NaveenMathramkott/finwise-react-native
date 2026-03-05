import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
 Image,
 KeyboardAvoidingView,
 Platform,
 StyleSheet,
 Text,
 TouchableOpacity,
 View
} from 'react-native';
import { Button, TextInput } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { COLORS } from '../../utils/theme';

const LoginScreen = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      // Mock login
      dispatch(
        setUser({
          id: '1',
          email: data.email,
          name: 'John Doe',
        })
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Welcome back!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Login error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
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
                left={
                  <TextInput.Icon
                    icon={() => <Ionicons name="mail-outline" size={22} color={COLORS.primary} />}
                  />
                }
                style={styles.input}
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

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
                left={
                  <TextInput.Icon
                    icon={() => <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={COLORS.primary}
                      />
                    )}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            onPress={handleSubmit(onSubmit)}
            mode="contained"
            loading={loading}
            style={styles.loginButton}
          >
            Sign In
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color:COLORS.textSecondary,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    marginTop: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginLeft: 4,
    // marginTop: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  signUpText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;