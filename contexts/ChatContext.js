import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useReducer } from 'react'

// Create context with proper typing
const ChatContext = createContext(null)

const initialState = {
  chats: [],
  currentChatId: null,
  currentMessages: [],
  isTyping: false,
  sidebarVisible: true,
  darkMode: false,
  user_id: null, // Will be set from auth
}

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, user_id: action.payload }
    
    case 'SET_CHATS':
      return { ...state, chats: action.payload }
    
    case 'CREATE_CHAT':
      const newChat = {
        id: action.payload.session_id,
        title: action.payload.title || 'New Chat',
        timestamp: new Date().toISOString(),
        starred: false,
        messages: []
      }
      return {
        ...state,
        chats: [newChat, ...state.chats],
        currentChatId: newChat.id,
        currentMessages: []
      }
    
    case 'SET_CURRENT_CHAT':
      const chat = state.chats.find(c => c.id === action.payload)
      return {
        ...state,
        currentChatId: action.payload,
        currentMessages: chat ? chat.messages : []
      }
    
    case 'ADD_MESSAGE':
      const updatedChats = state.chats.map(chat => {
        if (chat.id === state.currentChatId) {
          const updatedMessages = [...chat.messages, action.payload]
          return { ...chat, messages: updatedMessages }
        }
        return chat
      })
      
      const currentChat = updatedChats.find(c => c.id === state.currentChatId)
      return {
        ...state,
        chats: updatedChats,
        currentMessages: currentChat ? currentChat.messages : state.currentMessages
      }
    
    case 'UPDATE_CHAT_TITLE':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.chatId
            ? { ...chat, title: action.payload.title }
            : chat
        )
      }
    
    case 'TOGGLE_STAR':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload
            ? { ...chat, starred: !chat.starred }
            : chat
        )
      }
    
    case 'DELETE_CHAT':
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload)
      const newCurrentId = state.currentChatId === action.payload
        ? (filteredChats.length > 0 ? filteredChats[0].id : null)
        : state.currentChatId
      
      return {
        ...state,
        chats: filteredChats,
        currentChatId: newCurrentId,
        currentMessages: newCurrentId 
          ? filteredChats.find(c => c.id === newCurrentId)?.messages || []
          : []
      }
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload }
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarVisible: !state.sidebarVisible }
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
    
    case 'CLEAR_ALL_CHATS':
      return {
        ...state,
        chats: [],
        currentChatId: null,
        currentMessages: []
      }
    
    default:
      return state
  }
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  // Load chats when component mounts
  useEffect(() => {
    loadChats()
  }, [])

  // Save chats whenever they change
  useEffect(() => {
    if (state.chats.length > 0) {
      saveChats()
    }
  }, [state.chats])

  const loadChats = async () => {
    try {
      const savedChats = await AsyncStorage.getItem('chats')
      if (savedChats) {
        const chats = JSON.parse(savedChats)
        dispatch({ type: 'SET_CHATS', payload: chats })
      }
    } catch (error) {
      console.error('Error loading chats:', error)
    }
  }

  const saveChats = async () => {
    try {
      await AsyncStorage.setItem('chats', JSON.stringify(state.chats))
    } catch (error) {
      console.error('Error saving chats:', error)
    }
  }

  const createNewChat = () => {
    const session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    dispatch({
      type: 'CREATE_CHAT',
      payload: { session_id, title: 'New Chat' }
    })
    return { user_id: state.user_id, session_id }
  }

  const sendMessage = async (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    }
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
    dispatch({ type: 'SET_TYPING', payload: true })

    // Auto-update chat title if it's the first message
    const currentChat = state.chats.find(c => c.id === state.currentChatId)
    if (currentChat && currentChat.messages.length === 0) {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message
      dispatch({
        type: 'UPDATE_CHAT_TITLE',
        payload: { chatId: state.currentChatId, title }
      })
    }

    // Simulate AI response (replace with your Flask API call)
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: "I understand your question about " + message + ". Let me help you with that...",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage })
      dispatch({ type: 'SET_TYPING', payload: false })
    }, 2000)
  }

  const clearAllChats = async () => {
    try {
      await AsyncStorage.removeItem('chats')
      dispatch({ type: 'CLEAR_ALL_CHATS' })
    } catch (error) {
      console.error('Error clearing chats:', error)
    }
  }

  const setUserId = (userId) => {
    dispatch({ type: 'SET_USER_ID', payload: userId })
  }

  const value = {
    ...state,
    dispatch,
    createNewChat,
    sendMessage,
    clearAllChats,
    setUserId
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}