import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  Share,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../contexts/ChatContext'
import { auth } from '../../firebaseConfig'

export default function SettingsModal({ visible, onClose }) {
  const { user, signOut, updateProfile, updatePreferences } = useAuth()
  const { chats, clearAllChats } = useChat()
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const router = useRouter();

  if (!user) return null

  // const handleSignOut = () => {
  //   Alert.alert(
  //     'Sign Out',
  //     'Are you sure you want to sign out?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Sign Out',
  //         style: 'destructive',
  //         onPress: () => {
  //           onClose()
  //           signOut()
  //         }
  //       }
  //     ]
  //   )
  // }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              onClose(); // Close the modal
              
              // Navigate to login screen immediately
              router.replace('../screens/LoginScreen'); // or wherever your login screen is
              
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClearAllChats = () => {
    Alert.alert(
      'Clear All Chats',
      'This will permanently delete all your chat history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllChats()
            onClose()
          }
        }
      ]
    )
  }

  const handleExportChats = async () => {
    try {
      const chatData = JSON.stringify(chats, null, 2)
      await Share.share({
        message: 'EduLearn AI Chat Export',
        title: 'Chat History Export',
        url: `data:text/json;charset=utf-8,${encodeURIComponent(chatData)}`
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to export chats')
    }
  }

  const saveProfile = () => {
    if (editName.trim()) {
      updateProfile({ name: editName.trim() })
      setEditingProfile(false)
    }
  }

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    showArrow = true,
    color = 'white'
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)'
      }}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
      }}>
        <Icon name={icon} size={16} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          color: color,
          fontSize: 16,
          fontWeight: '500'
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            marginTop: 2
          }}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightComponent || (showArrow && (
        <Icon name="chevron-right" size={14} color="rgba(255,255,255,0.5)" />
      ))}
    </TouchableOpacity>
  )

  const SectionHeader = ({ title }) => (
    <Text style={{
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 8,
      marginHorizontal: 20,
      textTransform: 'uppercase',
      letterSpacing: 1
    }}>
      {title}
    </Text>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#0f0f23' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.1)',
          backgroundColor: '#1e1b4b'
        }}>
          <Text style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold'
          }}>
            Settings
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="times" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {/* Profile Section */}
          <View style={{
            backgroundColor: '#1e1b4b',
            paddingHorizontal: 20,
            paddingVertical: 24,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.1)'
          }}>
            {/* Avatar */}
            <TouchableOpacity style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#4f46e5',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              position: 'relative'
            }}>
              <Text style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold'
              }}>
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
              
              {/* Edit Icon */}
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#1e1b4b'
              }}>
                <Icon name="pencil" size={10} color="white" />
              </View>
            </TouchableOpacity>

            {/* Name */}
            {editingProfile ? (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <TextInput
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: '600',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginRight: 8,
                    minWidth: 150
                  }}
                  value={editName}
                  onChangeText={setEditName}
                  onBlur={saveProfile}
                  onSubmitEditing={saveProfile}
                  autoFocus
                />
                <TouchableOpacity onPress={saveProfile}>
                  <Icon name="check" size={16} color="#10b981" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setEditingProfile(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600',
                  marginRight: 8
                }}>
                  {user.name}
                </Text>
                <Icon name="pencil" size={14} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            )}

            <Text style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 14,
              marginBottom: 4
            }}>
              {user.email}
            </Text>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}>
              <Icon name="diamond" size={12} color="#10b981" />
              <Text style={{
                color: '#10b981',
                fontSize: 12,
                fontWeight: '600',
                marginLeft: 4
              }}>
                {user.subscription} Member
              </Text>
            </View>
          </View>

          {/* Account Settings */}
          <SectionHeader title="Account" />
          
          <SettingItem
            icon="user"
            title="Account Information"
            subtitle="Manage your account details"
            onPress={() => {}}
          />

          <SettingItem
            icon="credit-card"
            title="Subscription"
            subtitle={`${user.subscription} Plan`}
            onPress={() => {}}
          />

          <SettingItem
            icon="shield"
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            onPress={() => {}}
          />

          {/* App Preferences */}
          <SectionHeader title="Preferences" />

          <SettingItem
            icon="paint-brush"
            title="Theme"
            subtitle={user.preferences.theme === 'dark' ? 'Dark' : 'Light'}
            onPress={() => {}}
            rightComponent={
              <Switch
                value={user.preferences.theme === 'dark'}
                onValueChange={(value) => 
                  updatePreferences({ theme: value ? 'dark' : 'light' })
                }
                trackColor={{ false: '#767577', true: '#4f46e5' }}
                thumbColor="white"
              />
            }
            showArrow={false}
          />

          <SettingItem
            icon="bell"
            title="Notifications"
            subtitle="Push notifications"
            rightComponent={
              <Switch
                value={user.preferences.notifications}
                onValueChange={(value) => updatePreferences({ notifications: value })}
                trackColor={{ false: '#767577', true: '#4f46e5' }}
                thumbColor="white"
              />
            }
            showArrow={false}
          />

          <SettingItem
            icon="globe"
            title="Language"
            subtitle={user.preferences.language}
            onPress={() => {}}
          />

          <SettingItem
            icon="save"
            title="Auto-save Chats"
            subtitle="Automatically save conversations"
            rightComponent={
              <Switch
                value={user.preferences.autoSave}
                onValueChange={(value) => updatePreferences({ autoSave: value })}
                trackColor={{ false: '#767577', true: '#4f46e5' }}
                thumbColor="white"
              />
            }
            showArrow={false}
          />

          {/* Data & Storage */}
          <SectionHeader title="Data & Storage" />

          <SettingItem
            icon="download"
            title="Export Chat History"
            subtitle="Download your conversations"
            onPress={handleExportChats}
          />

          <SettingItem
            icon="trash"
            title="Clear All Chats"
            subtitle="Permanently delete all conversations"
            onPress={handleClearAllChats}
            color="#ef4444"
          />

          <SettingItem
            icon="database"
            title="Storage Usage"
            subtitle={`${chats.length} conversations stored`}
            onPress={() => {}}
          />

          {/* Support & Info */}
          <SectionHeader title="Support & Information" />

          <SettingItem
            icon="question-circle"
            title="Help & FAQ"
            subtitle="Get help and find answers"
            onPress={() => Linking.openURL('https://edulearn.ai/help')}
          />

          <SettingItem
            icon="comments"
            title="Contact Support"
            subtitle="Get in touch with our team"
            onPress={() => Linking.openURL('mailto:support@edulearn.ai')}
          />

          <SettingItem
            icon="share"
            title="Share EduLearn"
            subtitle="Invite friends to join"
            onPress={() => Share.share({
              message: 'Check out EduLearn AI - the smartest way to learn!',
              url: 'https://edulearn.ai'
            })}
          />

          <SettingItem
            icon="star"
            title="Rate the App"
            subtitle="Share your feedback"
            onPress={() => {}}
          />

          <SettingItem
            icon="info-circle"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />

          <SettingItem
            icon="file-text"
            title="Terms of Service"
            onPress={() => Linking.openURL('https://edulearn.ai/terms')}
          />

          <SettingItem
            icon="lock"
            title="Privacy Policy"
            onPress={() => Linking.openURL('https://edulearn.ai/privacy')}
          />

          {/* Sign Out */}
          <View style={{ marginTop: 32, marginBottom: 40, paddingHorizontal: 20 }}>
            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              <Text style={{
                color: '#ef4444',
                fontSize: 16,
                fontWeight: '600'
              }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}