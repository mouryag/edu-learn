import {
    addDoc,
    collection,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';

export function useChat() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Get user chats
  useEffect(() => {
    if (!user || !db) return;

    const getUserChats = async () => {
      try {
        setLoading(true);
        // Simple query without composite index
        const chatsRef = collection(db, 'chats');
        const snapshot = await getDocs(chatsRef);
        
        // Filter and sort in JavaScript to avoid index requirements
        const userChats = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(chat => chat.userId === user.uid)
          .sort((a, b) => {
            const aTime = a.timestamp?.seconds || 0;
            const bTime = b.timestamp?.seconds || 0;
            return bTime - aTime;
          });

        setChats(userChats);
        
        if (userChats.length === 0) {
          console.log('No chats found, creating dummy chats...');
          await createDummyChats();
        }
      } catch (error) {
        console.error('Error getting user chats:', error);
        await createDummyChats();
      } finally {
        setLoading(false);
      }
    };

    getUserChats();
  }, [user]);

  // Create dummy chats
  const createDummyChats = async () => {
    if (!user || !db) return;

    try {
      const chatsRef = collection(db, 'chats');
      
      const dummyChats = [
        {
          title: 'Math Help',
          lastMessage: 'How do I solve quadratic equations?',
          userId: user.uid,
          timestamp: serverTimestamp(),
        },
        {
          title: 'Science Questions', 
          lastMessage: 'Explain photosynthesis',
          userId: user.uid,
          timestamp: serverTimestamp(),
        },
        {
          title: 'History Study',
          lastMessage: 'Tell me about World War II',
          userId: user.uid,
          timestamp: serverTimestamp(),
        }
      ];

      for (const chat of dummyChats) {
        await addDoc(chatsRef, chat);
        console.log('Dummy chat created successfully');
      }
      
      // Refresh chats after creating dummy data
      setTimeout(() => {
        getUserChats();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating dummy chat:', error);
    }
  };

  // Create new chat
  const createNewChat = useCallback(async (title, initialMessage) => {
    if (!user || !db) return null;

    try {
      const chatsRef = collection(db, 'chats');
      const newChat = {
        title: title || 'New Chat',
        lastMessage: initialMessage || '',
        userId: user.uid,
        timestamp: serverTimestamp(),
      };
      
      const docRef = await addDoc(chatsRef, newChat);
      
      // Update local state immediately
      setChats(prev => [{ id: docRef.id, ...newChat }, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating new chat:', error);
      return null;
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (messageText, chatId = currentChatId) => {
    if (!messageText.trim() || !user || !db) return;

    try {
      setIsTyping(true);
      
      let targetChatId = chatId;
      
      // If no chat ID, create a new chat
      if (!targetChatId) {
        targetChatId = await createNewChat('New Chat', messageText);
        setCurrentChatId(targetChatId);
      }

      // Add message to messages collection
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        text: messageText,
        chatId: targetChatId,
        userId: user.uid,
        timestamp: serverTimestamp(),
        type: 'user'
      });

      // Update chat's last message
      // Note: You might want to update the chat document here
      
      console.log('Message sent successfully');
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  }, [user, currentChatId, createNewChat]);

  return {
    chats,
    messages,
    isTyping,
    currentChatId,
    loading,
    createNewChat,
    sendMessage,
    setCurrentChatId
  };
}