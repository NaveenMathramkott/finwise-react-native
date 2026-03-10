import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, HelperText, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSnackbar } from '../../hooks/useSnackbar';

const SupportScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      showSnackbar('Message Sent - Our support team will get back to you soon.', 'success');
      setLoading(false);
      reset();
      navigation.goBack();
    }, 1500);
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
            <Text variant="headlineSmall" style={styles.screenTitle}>Support</Text>
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
            
            <View style={styles.contactInfoContainer}>
                <Surface style={styles.contactIconBg} elevation={2}>
                  <Ionicons name="chatbubbles" size={40} color={theme.colors.primary} />
                </Surface>
                <Text variant="titleLarge" style={styles.contactTitle}>How can we help?</Text>
                <Text variant="bodyMedium" style={styles.contactSubtitle}>
                  Got a question or found a bug? Send us a message and we'll reply as soon as possible.
                </Text>
            </View>

            <Surface style={[styles.formCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <View style={styles.formContent}>
                <Controller
                  control={control}
                  name="subject"
                  rules={{ required: 'Subject is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Subject"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.subject}
                      style={styles.input}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="help-buoy-outline" size={20} color={theme.colors.primary} />} />}
                    />
                  )}
                />
                {errors.subject && <HelperText type="error" visible={true}>{errors.subject.message as string}</HelperText>}

                <Controller
                  control={control}
                  name="message"
                  rules={{
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Your Message"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.message}
                      style={[styles.input, { height: 120 }]}
                      multiline
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />} />}
                    />
                  )}
                />
                {errors.message && <HelperText type="error" visible={true}>{errors.message.message as string}</HelperText>}

                <Button
                  mode="contained"
                  loading={loading}
                  disabled={loading}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.submitBtn}
                  contentStyle={styles.submitBtnContent}
                  icon={() => <Ionicons name="send" size={20} color="white" />}
                >
                  Send Message
                </Button>
              </View>
            </Surface>
            
            <View style={styles.faqFooter}>
                <Text variant="bodySmall" style={styles.faqText}>Or email us directly at:</Text>
                <TouchableOpacity>
                    <Text variant="titleSmall" style={[styles.emailLink, { color: theme.colors.primary }]}>
                        support@finwiseapp.com
                    </Text>
                </TouchableOpacity>
            </View>

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
  },
  contactInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
    marginBottom: 32,
  },
  contactIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactSubtitle: {
    textAlign: 'center',
    paddingHorizontal: 40,
    opacity: 0.6,
  },
  formCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  formContent: {
    padding: 20,
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
  faqFooter: {
      alignItems: 'center',
      marginTop: 40,
  },
  faqText: {
      opacity: 0.6,
      marginBottom: 4,
  },
  emailLink: {
      fontWeight: 'bold',
  }
});

export default SupportScreen;
