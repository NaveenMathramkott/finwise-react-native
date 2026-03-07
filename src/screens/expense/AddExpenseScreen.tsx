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
 Menu,
 Text,
 TextInput,
 useTheme
} from 'react-native-paper';
import { DatePickerInput, en, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';
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
   <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.screenTitle}>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </Text>

            <View style={styles.imageSection}>
              {image ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.receiptImage} />
                  <TouchableOpacity 
                    style={[styles.removeImageBtn, { backgroundColor: theme.colors.error }]} 
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="receipt-outline" size={48} color={theme.colors.onSurfaceVariant} />
                  <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                    No receipt image attached
                  </Text>
                </View>
              )}
              
              <View style={styles.imageActions}>
                <Button mode="outlined" onPress={pickImage} icon="image" style={styles.actionBtn}>
                  Gallery
                </Button>
                <Button mode="outlined" onPress={takePhoto} icon="camera" style={styles.actionBtn}>
                  Camera
                </Button>
              </View>
            </View>

            <Controller
              control={control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Title"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.title}
                  style={styles.input}
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
                  left={<TextInput.Affix text="$" />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.amount}
                  style={styles.input}
                />
              )}
            />
            {errors.amount && <HelperText type="error">{errors.amount.message}</HelperText>}

            <View style={styles.pickerSection}>
              <Menu
                visible={categoryMenuVisible}
                onDismiss={() => setCategoryMenuVisible(false)}
                anchor={
                  <TouchableOpacity 
                    onPress={() => setCategoryMenuVisible(true)}
                    style={[styles.pickerTrigger, { borderColor: theme.colors.outline }]}
                  >
                    <View style={styles.pickerValue}>
                      <Ionicons 
                        name={(categories.find(c => c.name === selectedCategory)?.icon || 'help-circle') as any} 
                        size={20} 
                        color={categories.find(c => c.name === selectedCategory)?.color || theme.colors.primary} 
                      />
                      <Text style={{ marginLeft: 8 }}>{selectedCategory}</Text>
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
                    label="Date"
                    value={value}
                    onChange={onChange}
                    inputMode="start"
                    mode="outlined"
                    style={styles.input}
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
            >
              {editingExpense ? 'Update Expense' : 'Save Expense'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  screenTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    elevation: 4,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
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
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
  },
  input: {
    marginBottom: 4,
  },
  pickerSection: {
    marginVertical: 12,
  },
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  pickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerContainer: {
    marginBottom: 12,
  },
  submitBtn: {
    marginTop: 24,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default AddExpenseScreen;
