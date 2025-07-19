import React, { useState } from 'react'
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useChat } from '../../contexts/ChatContext'
import ProfileSection from './ProfileSection'
import SettingsModal from './SettingsModal'

export default function ChatSidebar() {
  const {
    chats,
    currentChatId,
    sidebarVisible,
    darkMode,
    dispatch,
    createNewChat
  } = useChat()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [settingsVisible, setSettingsVisible] = useState(false)

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewChat = () => {
    createNewChat()
  }

  const handleSelectChat = (chatId) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chatId })
  }

  const handleStarChat = (chatId) => {
    dispatch({ type: 'TOGGLE_STAR', payload: chatId })
  }

  const handleDeleteChat = (chatId) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch({ type: 'DELETE_CHAT', payload: chatId })
        }
      ]
    )
  }

  const handleRenameChat = (chatId, currentTitle) => {
    setEditingId(chatId)
    setEditTitle(currentTitle)
  }

  const saveRename = () => {
    if (editTitle.trim()) {
      dispatch({
        type: 'UPDATE_CHAT_TITLE',
        payload: { chatId: editingId, title: editTitle.trim() }
      })
    }
    setEditingId(null)
    setEditTitle('')
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (!sidebarVisible) {
    return (
      <TouchableOpacity
        onPress={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        style={{
          width: 50,
          backgroundColor: '#1e1b4b',
          justifyContent: 'center',
          alignItems: 'center',
          borderRightWidth: 1,
          borderRightColor: 'rgba(255,255,255,0.1)'
        }}
      >
        <Icon name="bars" size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>
    )
  }

  return (
    <View style={{
      width: 280,
      backgroundColor: '#1e1b4b',
      borderRightWidth: 1,
      borderRightColor: 'rgba(255,255,255,0.1)'
    }}>
      {/* Header */}
      <View style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)'
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          }}>
            EduLearn AI
          </Text>
          <TouchableOpacity
            onPress={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          >
            <Icon name="chevron-left" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <ProfileSection onOpenSettings={() => setSettingsVisible(true)} />

        {/* New Chat Button */}
        <TouchableOpacity
          onPress={handleNewChat}
          style={{
            backgroundColor: '#4f46e5',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#4f46e5',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: 16
          }}
        >
          <Icon name="plus" size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600'
          }}>
            New Chat
          </Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8
        }}>
          <Icon name="search" size={14} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 8,
              color: 'white',
              fontSize: 14
            }}
            placeholder="Search chats..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List */}
      <ScrollView style={{ flex: 1, padding: 8 }}>
        {/* Starred Chats Section */}
        {filteredChats.filter(chat => chat.starred).length > 0 && (
          <>
            <Text style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              fontWeight: '600',
              marginLeft: 12,
              marginBottom: 8,
              marginTop: 8,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              Starred
            </Text>
            {filteredChats.filter(chat => chat.starred).map((chat) => (
              <ChatItem
                key={`starred-${chat.id}`}
                chat={chat}
                currentChatId={currentChatId}
                editingId={editingId}
                editTitle={editTitle}
                onSelect={handleSelectChat}
                onStar={handleStarChat}
                onRename={handleRenameChat}
                onDelete={handleDeleteChat}
                setEditTitle={setEditTitle}
                saveRename={saveRename}
                formatTimestamp={formatTimestamp}
              />
            ))}
          </>
        )}

        {/* Recent Chats Section */}
        <Text style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 12,
          marginBottom: 8,
          marginTop: filteredChats.filter(chat => chat.starred).length > 0 ? 16 : 8,
          textTransform: 'uppercase',
          letterSpacing: 1
        }}>
          Recent
        </Text>

        {filteredChats.filter(chat => !chat.starred).map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            currentChatId={currentChatId}
            editingId={editingId}
            editTitle={editTitle}
            onSelect={handleSelectChat}
            onStar={handleStarChat}
            onRename={handleRenameChat}
            onDelete={handleDeleteChat}
            setEditTitle={setEditTitle}
            saveRename={saveRename}
            formatTimestamp={formatTimestamp}
          />
        ))}

        {filteredChats.length === 0 && (
          <View style={{
            alignItems: 'center',
            paddingVertical: 32
          }}>
            <Icon name="comments-o" size={32} color="rgba(255,255,255,0.3)" />
            <Text style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 14,
              marginTop: 8,
              textAlign: 'center'
            }}>
              {searchQuery ? 'No chats found' : 'Start a new conversation'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  )
}

// Extracted ChatItem component for better organization
const ChatItem = ({
  chat,
  currentChatId,
  editingId,
  editTitle,
  onSelect,
  onStar,
  onRename,
  onDelete,
  setEditTitle,
  saveRename,
  formatTimestamp
}) => (
  <TouchableOpacity
    onPress={() => onSelect(chat.id)}
    style={{
      backgroundColor: currentChatId === chat.id 
        ? 'rgba(79, 70, 229, 0.2)' 
        : 'transparent',
      borderRadius: 12,
      padding: 12,
      marginBottom: 4,
      borderWidth: currentChatId === chat.id ? 1 : 0,
      borderColor: currentChatId === chat.id 
        ? 'rgba(79, 70, 229, 0.5)' 
        : 'transparent'
    }}
  >
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Chat Title */}
      <View style={{ flex: 1, marginRight: 8 }}>
        {editingId === chat.id ? (
          <TextInput
            style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6
            }}
            value={editTitle}
            onChangeText={setEditTitle}
            onBlur={saveRename}
            onSubmitEditing={saveRename}
            autoFocus
          />
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500'
            }}
            numberOfLines={1}
          >
            {chat.title}
          </Text>
        )}
        <Text style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
          marginTop: 2
        }}>
          {formatTimestamp(chat.timestamp)}
        </Text>
      </View>

      {/* Action Icons */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={() => onStar(chat.id)}
          style={{ padding: 4, marginRight: 4 }}
        >
          <Icon
            name={chat.starred ? "star" : "star-o"}
            size={14}
            color={chat.starred ? "#fbbf24" : "rgba(255,255,255,0.5)"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onRename(chat.id, chat.title)}
          style={{ padding: 4, marginRight: 4 }}
        >
          <Icon name="edit" size={14} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(chat.id)}
          style={{ padding: 4 }}
        >
          <Icon name="trash" size={14} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
)