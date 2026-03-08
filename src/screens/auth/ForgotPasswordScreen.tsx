import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, HelperText, Text as PaperText, Surface, TextInput, useTheme } from "react-native-paper";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Email Sent',
          text2: 'Instructions to reset your password have been sent.',
        });
        setLoading(false);
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send reset email',
      });
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
        <Surface style={styles.logoContainer} elevation={4}>
           <Ionicons name="key" size={50} color={theme.colors.primary} />
        </Surface>
        <PaperText variant="displaySmall" style={[styles.title, { color: 'white' }]}>Reset Password</PaperText>
        <PaperText variant="bodyLarge" style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginHorizontal: 30 }}>
            Enter your email and we'll send you instructions to reset your password
        </PaperText>
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
                        label="Email Address"
                        mode="outlined"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Enter your registered email"
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

                  <Button
                    onPress={handleSubmit(onSubmit)}
                    mode="contained"
                    loading={loading}
                    disabled={loading}
                    style={styles.actionButton}
                    contentStyle={{ paddingVertical: 8 }}
                  >
                    Send Reset Link
                  </Button>
                  
                  <View style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                      <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
                      <PaperText style={[styles.backText, { color: theme.colors.primary }]}>Back to Login</PaperText>
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
    marginBottom: 12,
  },
  formCard: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  formContent: {
    padding: 24,
    paddingTop: 32,
  },
  input: {
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  actionButton: {
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
