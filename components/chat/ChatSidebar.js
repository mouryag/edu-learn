import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../contexts/ChatContext'
import ProfileSection from './ProfileSection'
import SettingsModal from './SettingsModal'

export default function ChatSidebar() {
  const {
    chats,
    currentChatId,
    sidebarVisible,
    isLoading,
    dispatch,
    createNewChat,
    deleteChat,
    updateChatTitle,
    toggleStarChat
  } = useChat()
  
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [settingsVisible, setSettingsVisible] = useState(false)

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewChat = async () => {
    const result = await createNewChat()
    if (!result) {
      Alert.alert('Error', 'Failed to create new chat. Please try again.')
    }
  }

  const handleSelectChat = (chatId) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chatId })
  }

  const handleStarChat = async (chatId) => {
    await toggleStarChat(chatId)
  }

  const handleDeleteChat = (chatId) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChat(chatId)
        }
      ]
    )
  }

  const handleRenameChat = (chatId, currentTitle) => {
    setEditingId(chatId)
    setEditTitle(currentTitle)
  }

  const saveRename = async () => {
    if (editTitle.trim() && editingId) {
      await updateChatTitle(editingId, editTitle.trim())
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
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  // When collapsed, return just a floating expand button
  if (!sidebarVisible) {
    return (
      <TouchableOpacity
        onPress={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          backgroundColor: '#4f46e5',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1000,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        }}
      >
        <Icon name="bars" size={12} color="white" style={{ marginRight: 2 }} />
      </TouchableOpacity>
    )
  }

  // Full sidebar view with reduced margins
  return (
    <View style={{
      width: 260,
      backgroundColor: '#1e1b4b',
      borderRightWidth: 1,
      borderRightColor: 'rgba(255,255,255,0.1)'
    }}>
      {/* Header with reduced padding */}
      <View style={{
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)'
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10
        }}>
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            EduLearn AI
          </Text>
          <TouchableOpacity
            onPress={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            style={{ padding: 4 }}
          >
            <Icon name="chevron-left" size={14} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        <ProfileSection onOpenSettings={() => setSettingsVisible(true)} />

        <TouchableOpacity
          onPress={handleNewChat}
          style={{
            backgroundColor: '#4f46e5',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10
          }}
        >
          <Icon name="plus" size={14} color="white" style={{ marginRight: 6 }} />
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '600'
          }}>
            New Chat
          </Text>
        </TouchableOpacity>

        <View style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 6
        }}>
          <Icon name="search" size={12} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 6,
              color: 'white',
              fontSize: 13
            }}
            placeholder="Search chats..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List with reduced padding */}
      <ScrollView style={{ flex: 1, padding: 6 }}>
        {isLoading ? (
          <View style={{
            alignItems: 'center',
            paddingVertical: 24
          }}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={{
              color: 'rgba(255,255,255,0.7)',
              marginTop: 6,
              fontSize: 13
            }}>
              Loading your chats...
            </Text>
          </View>
        ) : (
          <>
            {filteredChats.filter(chat => chat.starred).length > 0 && (
              <>
                <Text style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 11,
                  fontWeight: '600',
                  marginLeft: 8,
                  marginBottom: 4,
                  marginTop: 4,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  ⭐ Starred
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

            <Text style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 11,
              fontWeight: '600',
              marginLeft: 8,
              marginBottom: 4,
              marginTop: filteredChats.filter(chat => chat.starred).length > 0 ? 8 : 4,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              💬 Recent
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

            {filteredChats.length === 0 && !isLoading && (
              <View style={{
                alignItems: 'center',
                paddingVertical: 24
              }}>
                <Icon name="comments-o" size={28} color="rgba(255,255,255,0.3)" />
                <Text style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                  marginTop: 6,
                  textAlign: 'center'
                }}>
                  {searchQuery ? 'No chats found' : 'Start a new conversation!'}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  )
}

// ChatItem component with reduced padding
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
      borderRadius: 8,
      padding: 8,
      marginBottom: 2,
      marginHorizontal: 2,
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
      <View style={{ flex: 1, marginRight: 4 }}>
        {editingId === chat.id ? (
          <TextInput
            style={{
              color: 'white',
              fontSize: 13,
              fontWeight: '500',
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4
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
              fontSize: 13,
              fontWeight: '500'
            }}
            numberOfLines={1}
          >
            {chat.title}
          </Text>
        )}
        <Text style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 11,
          marginTop: 1
        }}>
          {formatTimestamp(chat.timestamp)}
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={() => onStar(chat.id)}
          style={{ padding: 3, marginRight: 2 }}
        >
          <Icon
            name={chat.starred ? "star" : "star-o"}
            size={12}
            color={chat.starred ? "#fbbf24" : "rgba(255,255,255,0.5)"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onRename(chat.id, chat.title)}
          style={{ padding: 3, marginRight: 2 }}
        >
          <Icon name="edit" size={12} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(chat.id)}
          style={{ padding: 3 }}
        >
          <Icon name="trash" size={12} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
)