import React, { useRef, useState } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useChat } from '../../contexts/ChatContext'

export default function ChatInput() {
  const { sendMessage, isTyping, currentChatId, createNewChat } = useChat()
  const [message, setMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(50)
  const sendButtonScale = useRef(new Animated.Value(1)).current

  const handleSend = async () => {
    if (message.trim() && !isTyping) {
      let chatInfo = { user_id: null, session_id: currentChatId }
      
      // Create new chat if none exists
      if (!currentChatId) {
        chatInfo = createNewChat()
      }

      const messageText = message.trim()
      setMessage('')
      setInputHeight(50)

      // Animate send button
      Animated.sequence([
        Animated.timing(sendButtonScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(sendButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start()

      // Send message
      await sendMessage(messageText)
    }
  }

  const handleContentSizeChange = (event) => {
    const newHeight = Math.min(Math.max(50, event.nativeEvent.contentSize.height + 20), 120)
    setInputHeight(newHeight)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{
        backgroundColor: '#1e1b4b',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 8,
          minHeight: 50
        }}>
          {/* File Upload Button (Future Enhancement) */}
          <TouchableOpacity
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              marginBottom: 4
            }}
          >
            <Icon name="paperclip" size={16} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            style={{
              flex: 1,
              color: 'white',
              fontSize: 16,
              maxHeight: 100,
              minHeight: 34,
              textAlignVertical: 'center'
            }}
            placeholder="Type your question..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={message}
            onChangeText={setMessage}
            multiline
            onContentSizeChange={handleContentSizeChange}
            editable={!isTyping}
            onSubmitEditing={(event) => {
              if (!event.nativeEvent.shiftKey) {
                handleSend()
              }
            }}
            blurOnSubmit={false}
          />

          {/* Send Button */}
          <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!message.trim() || isTyping}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: message.trim() && !isTyping ? '#4f46e5' : 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8,
                marginBottom: 4
              }}
            >
              <Icon 
                name={isTyping ? "circle-o-notch" : "send"} 
                size={16} 
                color="white" 
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Quick Actions (Optional) */}
        <View style={{
          flexDirection: 'row',
          marginTop: 8,
          paddingHorizontal: 8
        }}>
          {['Help with homework', 'Explain concept', 'Practice quiz'].map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setMessage(action)}
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                marginRight: 8
              }}
            >
              <Text style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 12
              }}>
                {action}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}