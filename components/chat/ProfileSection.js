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

export default function ProfileSection({ onOpenSettings }) {
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

  return (
    <View>
      {/* Profile Info */}
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
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 2
          }}>
            <Text style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12
            }}>
              {user.subscription}
            </Text>
            <View style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.5)',
              marginHorizontal: 6
            }} />
            <Text style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12
            }}>
              {user.totalChats} chats
            </Text>
          </View>
        </View>

        {/* Settings Icon */}
        <Icon name="cog" size={18} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={{
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8
      }}>
        {/* Settings Button */}
        <TouchableOpacity
          onPress={onOpenSettings}
          style={{
            flex: 1,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="cog" size={14} color="#4f46e5" />
          <Text style={{
            color: '#4f46e5',
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 6
          }}>
            Settings
          </Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            flex: 1,
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="sign-out" size={14} color="#ef4444" />
          <Text style={{
            color: '#ef4444',
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 6
          }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}