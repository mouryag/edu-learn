// contexts/ChatContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext(undefined);

const STORAGE_KEY = '@chat_data';
const USER_ID_KEY = '@user_id';

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load chats and user ID from storage on mount
  useEffect(() => {
    loadChatsFromStorage();
    loadUserIdFromStorage();
  }, []);

  // Save chats to storage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      saveChatsToStorage();
    }
  }, [chats]);

  // Save user ID whenever it changes
  useEffect(() => {
    if (userId) {
      saveUserIdToStorage();
    }
  }, [userId]);

  const loadUserIdFromStorage = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem(USER_ID_KEY);
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (err) {
      console.error('Failed to load user ID:', err);
    }
  };

  const saveUserIdToStorage = async () => {
    try {
      if (userId) {
        await AsyncStorage.setItem(USER_ID_KEY, userId);
      }
    } catch (err) {
      console.error('Failed to save user ID:', err);
    }
  };

  const loadChatsFromStorage = async () => {
    try {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedChats = JSON.parse(storedData).map((chat) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChats(parsedChats);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
      setError('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const saveChatsToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (err) {
      console.error('Failed to save chats:', err);
      setError('Failed to save chat history');
    }
  };

  const generateChatTitle = (messages) => {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
    }
    return 'New Chat';
  };

  // Check if there's already an empty chat (no messages)
  const findEmptyChat = () => {
    // Find any chat with no messages, prioritizing "New Chat" title
    const emptyChats = chats.filter(chat => chat.messages.length === 0);
    
    if (emptyChats.length === 0) return null;
    
    // Prioritize "New Chat" titled chats first
    const newChatTitled = emptyChats.find(chat => chat.title === 'New Chat');
    if (newChatTitled) return newChatTitled;
    
    // Return the most recently created empty chat
    return emptyChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  };

  const createChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if there's already an empty chat
      const existingEmptyChat = findEmptyChat();
      if (existingEmptyChat) {
        // Select the existing empty chat instead of creating a new one
        setCurrentChat(existingEmptyChat);
        console.log('Reusing existing empty chat:', existingEmptyChat.title);
        return;
      }
      
      // Only create a new chat if no empty chat exists
      const newChat = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: 'New Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId, // Associate chat with user
      };
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      console.log('Created new chat:', newChat.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setError(null);
    } else {
      setError('Chat not found');
    }
  };

  const deleteChat = (chatId) => {
    try {
      const updatedChats = chats.filter(c => c.id !== chatId);
      setChats(updatedChats);
      
      if (currentChat?.id === chatId) {
        // Select the next available chat or null
        setCurrentChat(updatedChats.length > 0 ? updatedChats[0] : null);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to delete chat');
    }
  };

  const updateChatTitle = (chatId, title) => {
    try {
      const updatedChats = chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: title.trim(), updatedAt: new Date() }
          : chat
      );
      
      setChats(updatedChats);
      
      if (currentChat?.id === chatId) {
        setCurrentChat(prev => prev ? { ...prev, title: title.trim() } : null);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to update chat title');
    }
  };

  const addMessage = (chatId, message) => {
    try {
      const newMessage = {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      };

      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: new Date(),
          };
          
          // Update title based on first user message if it's still "New Chat"
          if (updatedChat.title === 'New Chat' && message.role === 'user') {
            updatedChat.title = generateChatTitle(updatedChat.messages);
          }
          
          return updatedChat;
        }
        return chat;
      });

      setChats(updatedChats);
      
      if (currentChat?.id === chatId) {
        const updatedCurrentChat = updatedChats.find(c => c.id === chatId);
        setCurrentChat(updatedCurrentChat || null);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to add message');
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Function to clear all user data (useful for logout)
  const clearUserData = async () => {
    try {
      setChats([]);
      setCurrentChat(null);
      setUserId(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(USER_ID_KEY);
    } catch (err) {
      console.error('Failed to clear user data:', err);
    }
  };

  const value = {
    chats,
    currentChat,
    isLoading,
    error,
    userId,
    setUserId, // This is the function that was missing
    createChat,
    selectChat,
    deleteChat,
    updateChatTitle,
    addMessage,
    clearError,
    clearUserData,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}