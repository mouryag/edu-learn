import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
      
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload }
        }
      }
    
    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false
      }
    
    case 'SIGN_IN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false
      }
    
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const userData = await AsyncStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        dispatch({ type: 'SIGN_IN', payload: user })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const saveUserData = useCallback(async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const user = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0].replace(/[^a-zA-Z ]/g, '').replace(/\b\w/g, l => l.toUpperCase()) || 'User',
      email: email,
      avatar: null,
      subscription: 'Free',
      joinDate: new Date().toISOString(),
      totalChats: 0,
      preferences: {
        theme: 'dark',
        language: 'English',
        notifications: true,
        autoSave: true,
        dataSharing: false
      }
    }
    
    dispatch({ type: 'SIGN_IN', payload: user })
    await saveUserData(user)
    return user
  }, [saveUserData])

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['userData', 'chats'])
      dispatch({ type: 'SIGN_OUT' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }, [])

  const updateProfile = useCallback((updates) => {
    const updatedUser = { ...state.user, ...updates }
    dispatch({ type: 'UPDATE_USER', payload: updates })
    saveUserData(updatedUser)
  }, [state.user, saveUserData])

  const updatePreferences = useCallback((preferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
    const updatedUser = {
      ...state.user,
      preferences: { ...state.user.preferences, ...preferences }
    }
    saveUserData(updatedUser)
  }, [state.user, saveUserData])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    signIn,
    signOut,
    updateProfile,
    updatePreferences,
    dispatch
  }), [state.user, state.isAuthenticated, state.isLoading, signIn, signOut, updateProfile, updatePreferences])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}