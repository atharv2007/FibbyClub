import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
  cta?: {
    label: string;
    action: string;
  };
}

export default function ChatConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // If there's an initial prompt from params, start conversation
    if (params.prompt && typeof params.prompt === 'string') {
      handleSendMessage(params.prompt);
    }
  }, [params.prompt]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id || 'guest',
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        options: data.options || [],
        cta: data.cta,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    handleSendMessage(option);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Image
              source={require('../assets/fibbylogo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerTitle}>Fibby</Text>
              <Text style={styles.headerSubtitle}>Your Finance Buddy</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Image
                source={require('../assets/fibbylogo.png')}
                style={styles.emptyStateLogo}
                resizeMode="contain"
              />
              <Text style={styles.emptyStateTitle}>Hey {user?.name || 'there'}! 👋</Text>
              <Text style={styles.emptyStateText}>
                I'm Fibby, your personal finance buddy. Ask me anything about your money!
              </Text>
            </View>
          )}

          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              {message.type === 'user' ? (
                <View style={styles.userMessageContainer}>
                  <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>{message.content}</Text>
                    <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                  </View>
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={20} color={COLORS.surface} />
                  </View>
                </View>
              ) : (
                <View style={styles.botMessageContainer}>
                  <View style={styles.botAvatar}>
                    <Image
                      source={require('../assets/fibbylogo.png')}
                      style={styles.botAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.botMessageContent}>
                    <View style={styles.botMessage}>
                      <Text style={styles.botMessageText}>{message.content}</Text>
                      <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                    </View>

                    {/* MCQ Options */}
                    {message.options && message.options.length > 0 && (
                      <View style={styles.optionsContainer}>
                        {message.options.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.optionButton}
                            onPress={() => handleOptionSelect(option)}
                          >
                            <View style={styles.optionBullet}>
                              <Text style={styles.optionBulletText}>{String.fromCharCode(65 + index)}</Text>
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* CTA Button */}
                    {message.cta && (
                      <TouchableOpacity style={styles.ctaButton}>
                        <Text style={styles.ctaButtonText}>{message.cta.label}</Text>
                        <Ionicons name="arrow-forward" size={18} color={COLORS.surface} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.botAvatar}>
                <Image
                  source={require('../assets/fibbylogo.png')}
                  style={styles.botAvatarImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={COLORS.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? COLORS.surface : COLORS.disabled}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  menuButton: {
    padding: SPACING.xs,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyStateLogo: {
    width: 80,
    height: 80,
    marginBottom: SPACING.lg,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  messageWrapper: {
    marginBottom: SPACING.md,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    alignItems: 'flex-end',
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.card,
    borderBottomRightRadius: 4,
    maxWidth: '75%',
  },
  userMessageText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: SPACING.xs,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botMessageContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  botAvatarImage: {
    width: 36,
    height: 36,
  },
  botMessageContent: {
    flex: 1,
    gap: SPACING.md,
  },
  botMessage: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  botMessageText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    lineHeight: 22,
    marginBottom: SPACING.xs,
  },
  messageTime: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  optionsContainer: {
    gap: SPACING.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  optionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBulletText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.heading,
  },
  optionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.card,
    gap: SPACING.sm,
  },
  ctaButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.heading,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  typingIndicator: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.card,
    borderBottomLeftRadius: 4,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textSecondary,
  },
  inputContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    maxHeight: 100,
    paddingVertical: SPACING.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.surface,
  },
});
