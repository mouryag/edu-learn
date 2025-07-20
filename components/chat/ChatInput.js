import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useChat } from '../../contexts/ChatContext';

export default function ChatInput() {
  const { sendMessage, isTyping, currentChatId, createNewChat } = useChat();
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  // Debounce send to prevent rapid clicks
  const sending = useRef(false);

  const animateSend = () => {
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(sendButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleSend = async () => {
    if (!message.trim() || isTyping || sending.current) return;
    sending.current = true;
    animateSend();

    // Ensure chat exists
    if (!currentChatId) {
      await createNewChat();
    }

    const text = message.trim();
    setMessage('');
    setInputHeight(40);

    try {
      await sendMessage(text);
    } catch (err) {
      console.error('SendMessage Error:', err);
    }

    setTimeout(() => { sending.current = false; }, 500);
  };

  const onContentSizeChange = (e) => {
    const height = e.nativeEvent.contentSize.height + 8;
    setInputHeight(Math.min(Math.max(40, height), 120));
  };

  // Dismiss keyboard on server response end
  useEffect(() => {
    if (!isTyping) {
      Keyboard.dismiss();
    }
  }, [isTyping]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.inputRow}>
          {/* Attachment Button (placeholder) */}
          <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
            <Icon name="paperclip" size={20} color="rgba(0,0,0,0.3)" />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, { height: inputHeight }]}
            placeholder="Type a message..."
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={message}
            onChangeText={setMessage}
            multiline
            onContentSizeChange={onContentSizeChange}
            editable={!isTyping}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />

          <Animated.View style={[styles.sendButtonContainer, { transform: [{ scale: sendButtonScale }] }]}>  
            <TouchableOpacity
              style={[styles.sendButton, message.trim() && !isTyping ? styles.sendButtonActive : styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim() || isTyping}
            >
              <Icon name={isTyping ? 'circle-o-notch' : 'paper-plane'} size={18} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {['Help with homework', 'Explain concept', 'Practice quiz'].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickActionButton}
              onPress={() => setMessage(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: '#e0e0e0'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  attachButton: {
    padding: 8,
    marginBottom: 4
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#f2f2f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000'
  },
  sendButtonContainer: {
    marginLeft: 8,
    marginBottom: 4
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonActive: {
    backgroundColor: '#4f46e5'
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 8
  },
  quickActionButton: {
    backgroundColor: '#eef2ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8
  },
  quickActionText: {
    color: '#4f46e5',
    fontSize: 12
  }
});
