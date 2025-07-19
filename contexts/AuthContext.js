import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useReducer } from 'react'

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
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData')
      const authToken = await AsyncStorage.getItem('authToken')
      
      if (userData && authToken) {
        const user = JSON.parse(userData)
        dispatch({ type: 'SIGN_IN', payload: user })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Error checking auth state:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const signIn = async (userData, token) => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData))
      await AsyncStorage.setItem('authToken', token)
      
      // Update state
      dispatch({ type: 'SIGN_IN', payload: userData })
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove(['userData', 'authToken', 'chats'])
      
      // Update auth state
      dispatch({ type: 'SIGN_OUT' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...state.user, ...updates }
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser))
      dispatch({ type: 'UPDATE_USER', payload: updates })
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const updatePreferences = async (preferences) => {
    try {
      const updatedUser = {
        ...state.user,
        preferences: { ...state.user.preferences, ...preferences }
      }
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser))
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
  }

  const value = {
    ...state,
    signIn,
    signOut,
    updateProfile,
    updatePreferences,
    dispatch
  }

  return (
    <AuthContext.Provider value={value}>
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