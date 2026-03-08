import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
 FlatList,
 Keyboard,
 KeyboardAvoidingView,
 Platform,
 StyleSheet,
 TouchableOpacity,
 View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
 ActivityIndicator,
 IconButton,
 Surface,
 Text,
 TextInput,
 useTheme
} from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { clearChat, sendMessage } from '../../redux/slices/aiSlice';
import { RootState } from '../../redux/store';
import { CustomAlert } from '../../utils/AlertService';

const AIAssistantScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { messages, loading, suggestions } = useSelector((state: RootState) => state.ai);
  const { user } = useSelector((state: RootState) => state.auth);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || loading || !user) return;

    const question = inputText.trim();
    setInputText('');
    Keyboard.dismiss();

    try {
      // @ts-ignore
      const result = await dispatch(sendMessage({ 
        question, 
        userId: user.id 
      }));
      
      if (sendMessage.rejected.match(result)) {
        CustomAlert.alert('Error', 'AI_ASSISTANT', result.payload as string);
      }
    } catch (error) {
      CustomAlert.alert('Error', 'SYSTEM', 'Failed to send message');
    }
  };

  const handleClearChat = () => {
    CustomAlert.alert(
      'Clear Chat',
      'CONVERSATION',
      'Are you sure you want to clear the conversation?',
      () => dispatch(clearChat())
    );
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const renderMessage = ({ item, index }: { item: any, index: number }) => {
    return (
      <View style={styles.messageWrapper}>
        <Animated.View 
            entering={FadeInDown.duration(400)}
            style={[styles.messageBubble, styles.userBubble, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.userText}>{item.question}</Text>
        </Animated.View>
        
        {item.answer && (
          <Animated.View 
            entering={FadeInUp.delay(200).duration(400)}
            style={styles.aiMessageContainer}
          >
            <View style={[styles.aiAvatarCircle, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Ionicons name="logo-octocat" size={20} color={theme.colors.secondary} />
            </View>
            <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: theme.colors.surface }]}>
              <Text style={{ color: theme.colors.onSurface }}>{item.answer}</Text>
            </View>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Primary Background */}
      <View style={[styles.topBg, { backgroundColor: theme.colors.primary }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.headerWrapper}>
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <View style={styles.headerTop}>
            <View style={styles.aiInfo}>
                <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
                <View>
                    <Text variant="titleLarge" style={styles.screenTitle}>AI Finance Tutor</Text>
                    <Text variant="bodySmall" style={{ opacity: 0.6 }}>Always here to help you save</Text>
                </View>
            </View>
            <IconButton 
              icon="trash-can-outline" 
              iconColor={theme.colors.error} 
              size={24}
              onPress={handleClearChat}
              style={{ backgroundColor: theme.colors.error + '10' }}
            />
          </View>
        </Surface>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.welcomeContainer}>
              <Animated.View entering={FadeInDown.delay(300)}>
                  <Surface style={styles.botIconWrapper} elevation={2}>
                    <Ionicons name="sparkles" size={40} color={theme.colors.primary} />
                  </Surface>
                  <Text variant="headlineSmall" style={styles.welcomeTitle}>Ask FinWise AI</Text>
                  <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
                    Get personalized insights about your spending and saving habits.
                  </Text>
              </Animated.View>
            </View>
          }
          ListFooterComponent={
            loading ? (
              <Animated.View entering={FadeInUp} style={styles.aiMessageContainer}>
                <View style={[styles.aiAvatarCircle, { backgroundColor: theme.colors.secondary + '20' }]}>
                    <ActivityIndicator size="small" color={theme.colors.secondary} />
                </View>
                <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: theme.colors.surface }]}>
                  <Text variant="labelSmall" style={{ opacity: 0.5 }}>Thinking...</Text>
                </View>
              </Animated.View>
            ) : null
          }
        />

        <View style={styles.bottomArea}>
            {messages.length === 0 && (
              <View style={styles.suggestionsContainer}>
                <Text variant="labelMedium" style={styles.suggestionsTitle}>Suggested topics:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsWrapper}>
                  {suggestions.map((suggestion, index) => (
                    <TouchableOpacity 
                        key={index} 
                        onPress={() => handleSuggestionPress(suggestion)}
                    >
                        <Surface style={[styles.suggestionItem, { backgroundColor: theme.colors.surface }]} elevation={1}>
                            <Text variant="bodySmall">{suggestion}</Text>
                        </Surface>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Surface style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]} elevation={4}>
              <TextInput
                mode="flat"
                placeholder="Ask me a question..."
                value={inputText}
                onChangeText={setInputText}
                style={styles.input}
                multiline
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                right={
                  <TextInput.Icon 
                    icon="send-circle" 
                    color={inputText.trim() ? theme.colors.primary : theme.colors.outline}
                    onPress={handleSend}
                    disabled={!inputText.trim() || loading}
                    size={32}
                  />
                }
              />
            </Surface>
        </View>
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
  aiInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  statusIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 12,
  },
  screenTitle: {
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  botIconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      alignSelf: 'center',
  },
  welcomeTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 8,
    opacity: 0.6,
  },
  messageWrapper: {
    marginBottom: 20,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    maxWidth: '85%',
    elevation: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  userText: {
    color: 'white',
    fontWeight: '500',
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  aiAvatarCircle: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  bottomArea: {
      paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    marginLeft: 20,
    marginBottom: 10,
    opacity: 0.5,
    fontWeight: 'bold',
  },
  suggestionsWrapper: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionItem: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      marginRight: 8,
  },
  inputWrapper: {
    marginHorizontal: 16,
    borderRadius: 28,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 15,
  },
});

export default AIAssistantScreen;
