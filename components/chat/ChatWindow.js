import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useChat } from '../../contexts/ChatContext';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

export default function ChatWindow() {
  const { currentMessages = [], isTyping = false, currentChatId } = useChat();
  const scrollViewRef = useRef(null);
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;

  // Prevent flooding scrollToEnd calls
  const scrolling = useRef(false);
  const doScrollToEnd = () => {
    if (!scrollViewRef.current || scrolling.current) return;
    scrolling.current = true;
    scrollViewRef.current.scrollToEnd({ animated: true });
    setTimeout(() => (scrolling.current = false), 200);
  };

  // Auto-scroll on new messages or typing
  useEffect(() => {
    doScrollToEnd();
  }, [currentMessages.length, isTyping]);

  const handleScroll = ({ nativeEvent }) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    if (
      typeof contentOffset.y !== 'number' ||
      typeof layoutMeasurement.height !== 'number' ||
      typeof contentSize.height !== 'number'
    ) {
      return;
    }
    const isNearBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 100;

    // Animate opacity; no state updates here
    Animated.timing(scrollButtonOpacity, {
      toValue: isNearBottom ? 0 : 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const scrollToBottom = () => {
    doScrollToEnd();
    Animated.timing(scrollButtonOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  if (!currentChatId) {
    return (
      <View style={styles.centered}>
        <Icon name="comments" size={64} color="rgba(255,255,255,0.2)" />
        <Text style={styles.welcomeTitle}>Welcome to EduLearn AI</Text>
        <Text style={styles.welcomeSubtitle}>
          Ask me anything about your studies or homework.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {currentMessages.length === 0 && !isTyping ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Icon name="lightbulb-o" size={48} color="#4f46e5" />
            </View>
            <Text style={styles.emptyTitle}>Start Learning!</Text>
            <Text style={styles.emptyText}>
              Ask me anything about your studies or explore a topic.
            </Text>
          </View>
        ) : (
          <>
            {currentMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <TypingAnimation />
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Always render Animated.View; opacity drives visibility */}
      <Animated.View style={[styles.scrollButton, { opacity: scrollButtonOpacity }]}>
        <TouchableOpacity onPress={scrollToBottom} style={styles.scrollBtnTouchable}>
          <Icon name="chevron-down" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <ChatInput />
    </View>
  );
}

// Typing Animation Component
export function TypingAnimation() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    [
      { dot: dot1, delay: 0 },
      { dot: dot2, delay: 200 },
      { dot: dot3, delay: 400 }
    ].forEach(({ dot, delay }) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 600, useNativeDriver: true })
        ])
      ).start();
    });
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingDotsContainer}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.typingDot,
            { opacity: dot, transform: [{ scale: dot.interpolate({ inputRange: [0,1], outputRange: [0.8,1.2] }) }] }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23'
  },
  welcomeTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center'
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64
  },
  emptyIconBg: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32
  },

  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16
  },
  typingBubble: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    padding: 12,
    borderRadius: 20,
    borderTopLeftRadius: 4
  },
  typingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f46e5',
    marginHorizontal: 2
  },

  scrollButton: {
    position: 'absolute',
    bottom: 80,
    right: 16
  },
  scrollBtnTouchable: {
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
  }
});
