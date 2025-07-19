import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import FirebaseService from '../services/FirebaseService'

const ChatContext = createContext(null)

const initialState = {
  chats: [],
  currentChatId: null,
  currentMessages: [],
  isTyping: false,
  sidebarVisible: true,
  darkMode: false,
  user_id: null,
  isLoading: false
}

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
      
    case 'SET_USER_ID':
      return { ...state, user_id: action.payload }
      
    case 'SET_CHATS':
      return { ...state, chats: action.payload }
    
    case 'ADD_CHAT':
      return {
        ...state,
        chats: [action.payload, ...state.chats],
        currentChatId: action.payload.id,
        currentMessages: action.payload.messages || []
      }
    
    case 'SET_CURRENT_CHAT':
      const chat = state.chats.find(c => c.id === action.payload)
      return {
        ...state,
        currentChatId: action.payload,
        currentMessages: chat ? chat.messages : []
      }
    
    case 'UPDATE_CHAT_MESSAGES':
      const updatedChats = state.chats.map(chat => {
        if (chat.id === action.payload.chatId) {
          return { ...chat, messages: action.payload.messages }
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

  // Load chats from Firebase when user_id is available
  const loadUserChats = useCallback(async (userId) => {
    if (!userId) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      let chats = await FirebaseService.getUserChats(userId)
      
      // If no chats exist, create dummy chats for demonstration
      if (chats.length === 0) {
        console.log('No chats found, creating dummy chats...')
        chats = await FirebaseService.createDummyChats(userId)
      }
      
      dispatch({ type: 'SET_CHATS', payload: chats })
    } catch (error) {
      console.error('Error loading user chats:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Load chats when user_id changes
  useEffect(() => {
    if (state.user_id) {
      loadUserChats(state.user_id)
    }
  }, [state.user_id, loadUserChats])

  const createNewChat = useCallback(async () => {
    if (!state.user_id) {
      console.error('No user ID available')
      return null
    }

    try {
      const chatData = {
        title: 'New Chat',
        starred: false,
        messages: []
      }

      const newChat = await FirebaseService.createChat(state.user_id, chatData)
      dispatch({ type: 'ADD_CHAT', payload: newChat })
      
      return { user_id: state.user_id, session_id: newChat.id }
    } catch (error) {
      console.error('Error creating new chat:', error)
      return null
    }
  }, [state.user_id])

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || !state.currentChatId) return

    try {
      // Add user message to current chat
      const currentChat = state.chats.find(c => c.id === state.currentChatId)
      if (!currentChat) return

      const userMessage = {
        id: Date.now(),
        text: messageText.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      }

      const updatedMessages = [...currentChat.messages, userMessage]
      dispatch({ 
        type: 'UPDATE_CHAT_MESSAGES', 
        payload: { 
          chatId: state.currentChatId, 
          messages: updatedMessages 
        } 
      })

      dispatch({ type: 'SET_TYPING', payload: true })

      // Auto-update chat title if it's the first message
      if (currentChat.messages.length === 0) {
        const title = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText
        dispatch({
          type: 'UPDATE_CHAT_TITLE',
          payload: { chatId: state.currentChatId, title }
        })
        
        // Update title in Firebase
        await FirebaseService.updateChat(state.currentChatId, { title })
      }

      // Simulate AI response with educational content
      setTimeout(async () => {
        const aiResponses = [
          `Great question about "${messageText}"! Let me break this down for you step by step.\n\nThis is a common topic that students often find challenging, but once you understand the fundamentals, it becomes much clearer.\n\nWould you like me to explain it with some examples?`,
          
          `I understand you're asking about "${messageText}". This is an excellent learning opportunity!\n\nLet me provide you with a comprehensive explanation:\n\n• First, let's establish the basic concepts\n• Then we'll look at practical applications\n• Finally, I'll give you some practice problems\n\nShall we start with the fundamentals?`,
          
          `"${messageText}" - that's a fascinating topic! I love helping students explore this subject.\n\nHere's what I'd recommend we cover:\n1. Core principles and definitions\n2. Common misconceptions to avoid\n3. Real-world examples\n4. Practice exercises\n\nWhich aspect would you like to dive into first?`,
          
          `Excellent question! "${messageText}" is something many learners struggle with initially, but you're on the right track by asking.\n\nLet me share some insights that will help clarify this concept:\n\n✓ Key points to remember\n✓ Common pitfalls to avoid\n✓ Helpful memory techniques\n✓ Next steps for deeper learning\n\nWhat specific aspect would you like me to elaborate on?`
        ]

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
        
        const aiMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'ai',
          timestamp: new Date().toISOString()
        }

        const finalMessages = [...updatedMessages, aiMessage]
        
        dispatch({ 
          type: 'UPDATE_CHAT_MESSAGES', 
          payload: { 
            chatId: state.currentChatId, 
            messages: finalMessages 
          } 
        })
        
        dispatch({ type: 'SET_TYPING', payload: false })

        // Save updated messages to Firebase
        await FirebaseService.updateChat(state.currentChatId, { 
          messages: finalMessages,
          lastMessage: aiMessage
        })
      }, 2000)

    } catch (error) {
      console.error('Error sending message:', error)
      dispatch({ type: 'SET_TYPING', payload: false })
    }
  }, [state.chats, state.currentChatId])

  const deleteChat = useCallback(async (chatId) => {
    try {
      await FirebaseService.deleteChat(chatId)
      dispatch({ type: 'DELETE_CHAT', payload: chatId })
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }, [])

  const updateChatTitle = useCallback(async (chatId, title) => {
    try {
      await FirebaseService.updateChat(chatId, { title })
      dispatch({ 
        type: 'UPDATE_CHAT_TITLE', 
        payload: { chatId, title } 
      })
    } catch (error) {
      console.error('Error updating chat title:', error)
    }
  }, [])

  const toggleStarChat = useCallback(async (chatId) => {
    try {
      const chat = state.chats.find(c => c.id === chatId)
      if (chat) {
        const newStarredState = !chat.starred
        await FirebaseService.updateChat(chatId, { starred: newStarredState })
        dispatch({ type: 'TOGGLE_STAR', payload: chatId })
      }
    } catch (error) {
      console.error('Error toggling star:', error)
    }
  }, [state.chats])

  const clearAllChats = useCallback(async () => {
    try {
      // Delete all chats for the current user
      const deletePromises = state.chats.map(chat => 
        FirebaseService.deleteChat(chat.id)
      )
      await Promise.all(deletePromises)
      
      dispatch({ type: 'CLEAR_ALL_CHATS' })
    } catch (error) {
      console.error('Error clearing all chats:', error)
    }
  }, [state.chats])

  const setUserId = useCallback((userId) => {
    dispatch({ type: 'SET_USER_ID', payload: userId })
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    chats: state.chats,
    currentChatId: state.currentChatId,
    currentMessages: state.currentMessages,
    isTyping: state.isTyping,
    sidebarVisible: state.sidebarVisible,
    darkMode: state.darkMode,
    user_id: state.user_id,
    isLoading: state.isLoading,
    dispatch,
    createNewChat,
    sendMessage,
    deleteChat,
    updateChatTitle,
    toggleStarChat,
    clearAllChats,
    setUserId,
    loadUserChats
  }), [
    state.chats,
    state.currentChatId,
    state.currentMessages,
    state.isTyping,
    state.sidebarVisible,
    state.darkMode,
    state.user_id,
    state.isLoading,
    createNewChat,
    sendMessage,
    deleteChat,
    updateChatTitle,
    toggleStarChat,
    clearAllChats,
    setUserId,
    loadUserChats
  ])

  return (
    <ChatContext.Provider value={contextValue}>
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