import React, { useState } from 'react'
import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useChat } from '../../contexts/ChatContext'

export default function ChatHeader() {
  const {
    chats,
    currentChatId,
    sidebarVisible,
    dispatch
  } = useChat()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const handleRename = () => {
    if (currentChat) {
      setEditTitle(currentChat.title)
      setIsEditing(true)
    }
  }

  const saveRename = () => {
    if (editTitle.trim() && currentChatId) {
      dispatch({
        type: 'UPDATE_CHAT_TITLE',
        payload: { chatId: currentChatId, title: editTitle.trim() }
      })
    }
    setIsEditing(false)
  }

  const handleStar = () => {
    if (currentChatId) {
      dispatch({ type: 'TOGGLE_STAR', payload: currentChatId })
    }
  }

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'This will clear all messages in the current chat. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Clear messages logic here
            console.log('Clear chat messages')
          }
        }
      ]
    )
  }

  if (!currentChatId) {
    return (
      <View style={{
        backgroundColor: '#1e1b4b',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {!sidebarVisible && (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          >
            <Icon name="bars" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}
        
        <Text style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 16,
          fontWeight: '500'
        }}>
          EduLearn AI
        </Text>
        
        <View style={{ width: 20 }} />
      </View>
    )
  }

  return (
    <View style={{
      backgroundColor: '#1e1b4b',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {!sidebarVisible && (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            style={{ marginRight: 16 }}
          >
            <Icon name="bars" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}

        {/* Chat Title */}
        {isEditing ? (
          <TextInput
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              flex: 1
            }}
            value={editTitle}
            onChangeText={setEditTitle}
            onBlur={saveRename}
            onSubmitEditing={saveRename}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={handleRename} style={{ flex: 1 }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600'
              }}
              numberOfLines={1}
            >
              {currentChat?.title || 'New Chat'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Right Section - Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={handleStar}
          style={{ padding: 8, marginRight: 4 }}
        >
          <Icon
            name={currentChat?.starred ? "star" : "star-o"}
            size={18}
            color={currentChat?.starred ? "#fbbf24" : "rgba(255,255,255,0.7)"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClearChat}
          style={{ padding: 8 }}
        >
          <Icon name="refresh" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
    </View>
  )
}