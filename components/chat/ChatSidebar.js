import React, { useState } from 'react'
import {
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
    dispatch,
    createNewChat
  } = useChat()
  
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [settingsVisible, setSettingsVisible] = useState(false)

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Collapsed sidebar view
  if (!sidebarVisible) {
    return (
      <View style={{
        width: 60,
        backgroundColor: '#1e1b4b',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 16
      }}>
        {/* Expand Button */}
        <TouchableOpacity
          onPress={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            alignItems: 'center',
            paddingVertical: 12,
            marginBottom: 16
          }}
        >
          <Icon name="bars" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* New Chat Button */}
        <TouchableOpacity
          onPress={() => {
            createNewChat()
            dispatch({ type: 'TOGGLE_SIDEBAR' }) // Expand to show new chat
          }}
          style={{
            alignItems: 'center',
            paddingVertical: 12,
            marginBottom: 16
          }}
        >
          <View style={{
            backgroundColor: '#4f46e5',
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Icon name="plus" size={16} color="white" />
          </View>
        </TouchableOpacity>

        {/* Profile Section - Collapsed */}
        <ProfileSection 
          onOpenSettings={() => setSettingsVisible(true)} 
          isCollapsed={true}
        />

        {/* Settings Modal */}
        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </View>
    )
  }

  // Full sidebar view
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

        {/* Profile Section - Full */}
        <ProfileSection onOpenSettings={() => setSettingsVisible(true)} />

        {/* New Chat Button */}
        <TouchableOpacity
          onPress={createNewChat}
          style={{
            backgroundColor: '#4f46e5',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
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
        {/* Rest of your chat list implementation */}
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            onPress={() => dispatch({ type: 'SET_CURRENT_CHAT', payload: chat.id })}
            style={{
              backgroundColor: currentChatId === chat.id 
                ? 'rgba(79, 70, 229, 0.2)' 
                : 'transparent',
              borderRadius: 12,
              padding: 12,
              marginBottom: 4
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500'
            }} numberOfLines={1}>
              {chat.title}
            </Text>
          </TouchableOpacity>
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