import React, { useState } from 'react'
import {
    Clipboard,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.sender === 'user'

  const copyToClipboard = () => {
    Clipboard.setString(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <View style={{
      flexDirection: 'row',
      marginBottom: 16,
      justifyContent: isUser ? 'flex-end' : 'flex-start'
    }}>
      {/* AI Avatar */}
      {!isUser && (
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#4f46e5',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
          marginTop: 4
        }}>
          <Icon name="graduation-cap" size={16} color="white" />
        </View>
      )}

      {/* Message Content */}
      <View style={{
        maxWidth: '75%',
        backgroundColor: isUser 
          ? '#4f46e5' 
          : 'rgba(255,255,255,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderTopRightRadius: isUser ? 4 : 16,
        borderTopLeftRadius: isUser ? 16 : 4,
        position: 'relative'
      }}>
        <Text style={{
          color: 'white',
          fontSize: 16,
          lineHeight: 22
        }}>
          {message.text}
        </Text>

        {/* Message Actions */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8
        }}>
          <Text style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12
          }}>
            {formatTime(message.timestamp)}
          </Text>

          <TouchableOpacity
            onPress={copyToClipboard}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Icon 
              name={copied ? "check" : "copy"} 
              size={12} 
              color="rgba(255,255,255,0.7)" 
            />
            <Text style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 10,
              marginLeft: 4
            }}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Avatar */}
      {isUser && (
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 12,
          marginTop: 4
        }}>
          <Icon name="user" size={16} color="white" />
        </View>
      )}
    </View>
  )
}