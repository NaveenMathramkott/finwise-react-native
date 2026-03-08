import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
 Image,
 KeyboardAvoidingView,
 Platform,
 ScrollView,
 StyleSheet,
 TouchableOpacity,
 View
} from 'react-native';
import {
 Button,
 Card,
 HelperText,
 IconButton,
 Menu,
 Surface,
 Text,
 TextInput,
 useTheme
} from 'react-native-paper';
import { DatePickerInput, en, registerTranslation } from 'react-native-paper-dates';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense } from '../../redux/slices/expensesSlice';
import { RootState } from '../../redux/store';

registerTranslation('en', en);

type FormData = {
  title: string;
  amount: string;
  category: string;
  date: Date;
};

const AddExpenseScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.expenses);
  const editingExpense = route.params?.expense;
  
  const [image, setImage] = useState<string | null>(editingExpense?.image || null);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: editingExpense?.title || '',
      amount: editingExpense?.amount?.toString() || '',
      category: editingExpense?.category || 'Other',
      date: editingExpense?.date ? new Date(editingExpense.date) : new Date(),
    },
  });

  const selectedCategory = watch('category');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission denied', text2: 'We need gallery access' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission denied', text2: 'We need camera access' });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = (data: FormData) => {
    setLoading(true);
    try {
      const expenseData = {
        id: editingExpense?.id || Date.now().toString(),
        title: data.title,
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date.toISOString().split('T')[0],
        image: image || undefined,
      };

      if (editingExpense) {
        dispatch(updateExpense(expenseData));
        Toast.show({ type: 'success', text1: 'Success', text2: 'Expense updated' });
      } else {
        dispatch(addExpense(expenseData));
        Toast.show({ type: 'success', text1: 'Success', text2: 'Expense added' });
      }
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save expense' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Primary Background */}
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text variant="headlineSmall" style={styles.screenTitle}>
            {editingExpense ? 'Edit Transaction' : 'Add Transaction'}
          </Text>
          <View style={{ width: 40 }} />
        </Surface>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
        >
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            {/* Image Section */}
            <View style={styles.imageSection}>
              <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
                {image ? (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: image }} style={styles.receiptImage} />
                      <TouchableOpacity 
                        style={[styles.removeImageBtn, { backgroundColor: theme.colors.error }]} 
                        onPress={(e) => {
                            e.stopPropagation();
                            setImage(null);
                        }}
                      >
                        <Ionicons name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                ) : (
                    <Surface style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surface }]} elevation={2}>
                      <View style={[styles.uploadCircle, { backgroundColor: theme.colors.primary + '10' }]}>
                        <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.primary} />
                      </View>
                      <Text variant="titleSmall" style={{ marginTop: 12 }}>Upload Receipt</Text>
                      <Text variant="bodySmall" style={{ opacity: 0.5 }}>Tap to choose or take photo</Text>
                    </Surface>
                )}
              </TouchableOpacity>
              
              <View style={styles.imageActions}>
                  <IconButton icon="camera-outline" mode="outlined" size={20} onPress={takePhoto} />
                  <IconButton icon="image-outline" mode="outlined" size={20} onPress={pickImage} />
              </View>
            </View>

            <Card style={styles.formCard}>
              <Card.Content>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Transaction Title"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.title}
                      style={styles.input}
                      outlineStyle={{ borderRadius: 16 }}
                      placeholder="e.g. Weekly Groceries"
                    />
                  )}
                />
                {errors.title && <HelperText type="error">{errors.title.message}</HelperText>}

                <Controller
                  control={control}
                  name="amount"
                  rules={{ 
                    required: 'Amount is required',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Enter a valid amount'
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Amount"
                      mode="outlined"
                      keyboardType="numeric"
                      left={<TextInput.Affix text="AED" />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.amount}
                      style={styles.input}
                      outlineStyle={{ borderRadius: 16 }}
                      placeholder="0.00"
                    />
                  )}
                />
                {errors.amount && <HelperText type="error">{errors.amount.message}</HelperText>}

                <View style={styles.pickerSection}>
                  <Text variant="labelLarge" style={styles.pickerLabel}>Category</Text>
                  <Menu
                    visible={categoryMenuVisible}
                    onDismiss={() => setCategoryMenuVisible(false)}
                    contentStyle={{ borderRadius: 20 }}
                    anchor={
                      <TouchableOpacity 
                        onPress={() => setCategoryMenuVisible(true)}
                        style={[styles.pickerTrigger, { borderColor: theme.colors.outline }]}
                      >
                        <View style={styles.pickerValue}>
                          <View style={[styles.catIconCircle, { backgroundColor: (categories.find(c => c.name === selectedCategory)?.color || theme.colors.primary) + '15' }]}>
                              <Ionicons 
                                name={(categories.find(c => c.name === selectedCategory)?.icon || 'help-circle') as any} 
                                size={18} 
                                color={categories.find(c => c.name === selectedCategory)?.color || theme.colors.primary} 
                              />
                          </View>
                          <Text variant="bodyLarge" style={{ marginLeft: 12 }}>{selectedCategory}</Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
                      </TouchableOpacity>
                    }
                  >
                    {categories.map((cat) => (
                      <Menu.Item 
                        key={cat.id} 
                        onPress={() => {
                          setValue('category', cat.name);
                          setCategoryMenuVisible(false);
                        }} 
                        title={cat.name}
                        leadingIcon={() => <Ionicons name={cat.icon as any} size={20} color={cat.color} />}
                      />
                    ))}
                  </Menu>
                </View>

                <View style={styles.datePickerContainer}>
                  <Controller
                    control={control}
                    name="date"
                    rules={{ 
                      required: 'Date is required',
                      validate: (v) => v <= new Date() || 'Date cannot be in the future'
                    }}
                    render={({ field: { onChange, value } }) => (
                      <DatePickerInput
                        locale="en"
                        label="Transaction Date"
                        value={value}
                        onChange={onChange}
                        inputMode="start"
                        mode="outlined"
                        style={styles.input}
                        outlineStyle={{ borderRadius: 16 }}
                      />
                    )}
                  />
                  {errors.date && <HelperText type="error">{errors.date.message}</HelperText>}
                </View>

                <Button
                  mode="contained"
                  loading={loading}
                  disabled={loading}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.submitBtn}
                  contentStyle={styles.submitBtnContent}
                >
                  {editingExpense ? 'Update Records' : 'Save Transaction'}
                </Button>
              </Card.Content>
            </Card>
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
    marginBottom: 10,
  },
  headerCard: {
    borderRadius: 32,
    padding: 12,
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
    fontSize: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageBox: {
      width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  uploadCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
  },
  imageActions: {
      flexDirection: 'row',
      marginTop: -20,
      backgroundColor: 'white',
      borderRadius: 20,
      elevation: 4,
      paddingHorizontal: 8,
  },
  formCard: {
    borderRadius: 32,
    elevation: 2,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  input: {
    marginBottom: 4,
    backgroundColor: 'white',
  },
  pickerSection: {
    marginVertical: 12,
  },
  pickerLabel: {
      marginLeft: 4,
      marginBottom: 8,
      fontWeight: 'bold',
      opacity: 0.6,
  },
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  pickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  },
  datePickerContainer: {
    marginBottom: 12,
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 20,
    elevation: 4,
  },
  submitBtnContent: {
    paddingVertical: 10,
  },
});

export default AddExpenseScreen;
