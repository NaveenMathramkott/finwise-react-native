import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, HelperText, Text as PaperText, Surface, TextInput, useTheme } from "react-native-paper";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '../../hooks/useSnackbar';
import { setUser } from '../../redux/slices/authSlice';

const RegisterScreen = ({ navigation }: any) => {
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
      name: '',
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
            id: Date.now().toString(),
            email: data.email,
            name: data.name,
          })
        );
        showSnackbar('Success - Account created successfully!', 'success');
        setLoading(false);
      }, 1000);
    } catch (error) {
      showSnackbar('Error - Registration failed', 'error');
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
        <Surface style={styles.logoContainer} elevation={4}>
           <Ionicons name="rocket" size={50} color={theme.colors.primary} />
        </Surface>
        <PaperText variant="displaySmall" style={[styles.title, { color: 'white' }]}>Create Account</PaperText>
        <PaperText variant="bodyLarge" style={{ color: 'rgba(255,255,255,0.8)' }}>Start your financial journey today</PaperText>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeInUp.duration(800).delay(300)}>
              <Surface style={[styles.formCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
                <View style={styles.formContent}>
                  
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
                        outlineStyle={{ borderRadius: 16 }}
                        left={<TextInput.Icon icon={() => <Ionicons name="person-outline" size={22} color={theme.colors.primary} />} />}
                        style={styles.input}
                      />
                    )}
                  />
                  {errors.name && <HelperText type="error" visible={true}>{errors.name.message as string}</HelperText>}

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
                        placeholder="Create a password"
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

                  <Button
                    onPress={handleSubmit(onSubmit)}
                    mode="contained"
                    loading={loading}
                    disabled={loading}
                    style={styles.registerButton}
                    contentStyle={{ paddingVertical: 8 }}
                  >
                    Sign Up
                  </Button>
                  
                  <View style={styles.footer}>
                    <PaperText style={{ color: theme.colors.onSurfaceVariant }}>Already have an account? </PaperText>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <PaperText style={[styles.signInText, { color: theme.colors.primary }]}>Sign In</PaperText>
                    </TouchableOpacity>
                  </View>

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
    height: '40%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
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
  registerButton: {
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
