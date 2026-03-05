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

const RegisterScreen = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Mock registration
      dispatch(
        setUser({
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
        })
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Registration failed',
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your financial journey today</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Full name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Full Name"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your full name"
                autoCapitalize="words"
                error={!!errors.name}
                left={
                  <TextInput.Icon
                    icon={() => <Ionicons name="person-outline" size={22} color={COLORS.primary} />}
                  />
                }
                style={styles.input}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

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
                placeholder="Create a password"
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

          <Button
            onPress={handleSubmit(onSubmit)}
            mode="contained"
            loading={loading}
            style={styles.registerButton}
          >
            Sign Up
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}>Sign In</Text>
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
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  registerButton: {
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
  signInText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
