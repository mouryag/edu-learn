import React, { useEffect, useRef } from 'react'
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useChat } from '../../contexts/ChatContext'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

export default function ChatWindow() {
  const { currentMessages, isTyping, currentChatId } = useChat()
  const scrollViewRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = React.useState(false)
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [currentMessages, isTyping])

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const isNearBottom = 
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 100

    if (!isNearBottom && !showScrollButton) {
      setShowScrollButton(true)
      Animated.timing(scrollButtonOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else if (isNearBottom && showScrollButton) {
      setShowScrollButton(false)
      Animated.timing(scrollButtonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  if (!currentChatId) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f23'
      }}>
        <Icon name="comments" size={64} color="rgba(255,255,255,0.2)" />
        <Text style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 18,
          marginTop: 16,
          textAlign: 'center'
        }}>
          Welcome to EduLearn AI
        </Text>
        <Text style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 14,
          marginTop: 8,
          textAlign: 'center',
          paddingHorizontal: 32
        }}>
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {currentMessages.length === 0 && !isTyping ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 64
          }}>
            <View style={{
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              padding: 24,
              borderRadius: 24,
              marginBottom: 24
            }}>
              <Icon name="lightbulb-o" size={48} color="#4f46e5" />
            </View>
            <Text style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 8
            }}>
              Start Learning!
            </Text>
            <Text style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 16,
              textAlign: 'center',
              paddingHorizontal: 32
            }}>
              Ask me anything about your studies, homework, or any topic you'd like to explore
            </Text>
          </View>
        ) : (
          <>
            {currentMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
                paddingHorizontal: 16
              }}>
                <View style={{
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  padding: 12,
                  borderRadius: 20,
                  borderTopLeftRadius: 4
                }}>
                  <TypingAnimation />
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 80,
            right: 16,
            opacity: scrollButtonOpacity
          }}
        >
          <TouchableOpacity
            onPress={scrollToBottom}
            style={{
              backgroundColor: '#4f46e5',
              width: 48,
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }}
          >
            <Icon name="chevron-down" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Chat Input */}
      <ChatInput />
    </View>
  )
}

// Typing Animation Component
const TypingAnimation = () => {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          })
        ])
      ).start()
    }

    animateDot(dot1, 0)
    animateDot(dot2, 200)
    animateDot(dot3, 400)
  }, [])

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#4f46e5',
            marginHorizontal: 2,
            opacity: dot,
            transform: [{
              scale: dot.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2]
              })
            }]
          }}
        />
      ))}
    </View>
  )
}