import React, { useEffect } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChatHeader from '../components/chat/ChatHeader'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatWindow from '../components/chat/ChatWindow'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { ChatProvider, useChat } from '../contexts/ChatContext'

export default function HomeScreen() {
  return (
    <AuthProvider>
      <ChatProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1b4b' }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ChatInterface />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ChatProvider>
    </AuthProvider>
  )
}

const ChatInterface = () => {
  const { user } = useAuth()
  const { setUserId } = useChat()

  // Set user ID in chat context when user is available
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id)
    }
  }, [user?.id, setUserId])

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <ChatSidebar />
      <View style={{ flex: 1, backgroundColor: '#0f0f23' }}>
        <ChatHeader />
        <ChatWindow />
      </View>
    </View>
  )
}