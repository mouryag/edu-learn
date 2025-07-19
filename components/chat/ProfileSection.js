import React from 'react'
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useAuth } from '../../contexts/AuthContext'

export default function ProfileSection({ onOpenSettings, isCollapsed = false }) {
  const { user, signOut } = useAuth()

  if (!user) return null

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut
        }
      ]
    )
  }

  // Collapsed view for when sidebar is minimized
  if (isCollapsed) {
    return (
      <View style={{
        alignItems: 'center',
        paddingVertical: 16
      }}>
        <TouchableOpacity
          onPress={onOpenSettings}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#4f46e5',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8
          }}
        >
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold'
          }}>
            {getInitials(user.name)}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            padding: 8,
            borderRadius: 8
          }}
        >
          <Icon name="sign-out" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      {/* Profile Info - Only the main profile area is clickable for settings */}
      <TouchableOpacity
        onPress={onOpenSettings}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        {/* Avatar */}
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#4f46e5',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12
        }}>
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
          ) : (
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
              {getInitials(user.name)}
            </Text>
          )}
          
          {/* Online Status */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#10b981',
            borderWidth: 2,
            borderColor: '#1e1b4b'
          }} />
        </View>

        {/* User Info */}
        <View style={{ flex: 1 }}>
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600'
          }} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            marginTop: 2
          }} numberOfLines={1}>
            {user.email}
          </Text>
        </View>

        {/* Settings Icon */}
        <Icon name="cog" size={18} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      {/* Logout Button - Separate from settings */}
      {/* <TouchableOpacity
        onPress={handleSignOut}
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          borderWidth: 1,
          borderColor: 'rgba(239, 68, 68, 0.2)'
        }}
      >
        <Icon name="sign-out" size={14} color="#ef4444" />
        <Text style={{
          color: '#ef4444',
          fontSize: 14,
          fontWeight: '600',
          marginLeft: 8
        }}>
          Sign Out
        </Text>
      </TouchableOpacity> */}
    </View>
  )
}