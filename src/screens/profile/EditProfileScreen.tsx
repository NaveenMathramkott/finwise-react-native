import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Button, HelperText, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSnackbar } from '../../hooks/useSnackbar';
import { updateUser } from '../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { CustomAlert } from '../../utils/AlertService';

const EditProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      designation:user?.designation || '',
      accountId:user?.accountId || '',
    },
  });


  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("User ID is required to update profile.");
      const resultAction = await dispatch(
        updateUser({
          userId: user.id,
          accountId: user.accountId,
          name: data.name,
          email: data.email,
          designation: data.designation,
          phone: data.phone,
          bio: data.bio,
        })
      );

      if (updateUser.fulfilled.match(resultAction)) {
        CustomAlert.show({
          title: 'Profile Updated',
          subtitle: 'Success',
          message: 'Your information has been saved successfully.',
          buttons: [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
              style: 'default',
            },
          ],
        });
      } else {
        const errorMsg = resultAction.payload as string || 'Your information has not been saved.';
        showSnackbar(`Error - ${errorMsg}`, 'error');
      }
    } catch (error: any) {
      showSnackbar('Error - Something went wrong while saving your profile.', 'error');
    } finally {
      setLoading(false);
    }
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
            <Text variant="headlineSmall" style={styles.screenTitle}>Edit Profile</Text>
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
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Avatar.Text
                  size={100}
                  label={user?.name?.charAt(0) || 'U'}
                  style={{ backgroundColor: theme.colors.primary }}
                  labelStyle={{ fontSize: 36 }}
                />
                <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: theme.colors.secondary }]}>
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <Surface style={[styles.formCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <View style={styles.formContent}>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="User Name"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.name}
                      style={styles.input}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="person-outline" size={20} color={theme.colors.primary} />} />}
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
                      label="Email Address"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.email}
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />} />}
                    />
                  )}
                />
                {errors.email && <HelperText type="error" visible={true}>{errors.email.message as string}</HelperText>}

<Controller
                  control={control}
                  name="designation"
                  rules={{ required: 'Designation is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Designation"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.designation}
                      style={styles.input}
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="briefcase-outline" size={20} color={theme.colors.primary} />} />}
                    />
                  )}
                />
                {errors.designation && <HelperText type="error" visible={true}>{errors.designation.message as string}</HelperText>}
               
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Phone Number"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                      keyboardType="phone-pad"
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="call-outline" size={20} color={theme.colors.primary} />} />}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bio"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Bio"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.input, { height: 100 }]}
                      multiline
                      outlineStyle={{ borderRadius: 16 }}
                      left={<TextInput.Icon icon={() => <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />} />}
                    />
                  )}
                />

                <Button
                  mode="contained"
                  loading={loading}
                  disabled={loading}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.submitBtn}
                  contentStyle={styles.submitBtnContent}
                >
                  Save Changes
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
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
  },
  editAvatarBtn: {
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
    elevation: 4,
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
    marginTop: 20,
    borderRadius: 16,
  },
  submitBtnContent: {
    paddingVertical: 8,
  },
});

export default EditProfileScreen;
