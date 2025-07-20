import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { auth } from '../firebaseConfig';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user?.preferences,
            ...action.payload,
          },
        },
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'AUTH_STATE_CHANGED':
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'logged in' : 'logged out');
      
      if (firebaseUser) {
        // User is signed in, load or create user profile
        const userData = await loadOrCreateUserProfile(firebaseUser);
        dispatch({ type: 'AUTH_STATE_CHANGED', payload: userData });
      } else {
        // User is signed out
        dispatch({ type: 'AUTH_STATE_CHANGED', payload: null });
        await AsyncStorage.multiRemove(['userData', 'chats']);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadOrCreateUserProfile = useCallback(async (firebaseUser) => {
    try {
      // Try to load existing user data
      const storedUserData = await AsyncStorage.getItem('userData');
      
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        // Update with latest Firebase data
        const updatedUser = {
          ...userData,
          id: firebaseUser.uid,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          lastLoginAt: new Date().toISOString(),
        };
        await saveUserData(updatedUser);
        return updatedUser;
      } else {
        // Create new user profile
        const newUser = {
          id: firebaseUser.uid,
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split('@')[0]
              .replace(/[^a-zA-Z ]/g, '')
              .replace(/\b\w/g, (l) => l.toUpperCase()) ||
            'User',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          subscription: 'Free',
          joinDate: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          totalChats: 0,
          totalMessages: 0,
          preferences: {
            theme: 'light',
            language: 'English',
            notifications: true,
            autoSave: true,
            dataSharing: false,
            fontSize: 'medium',
            soundEnabled: true,
          },
          settings: {
            twoFactorEnabled: false,
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
          }
        };
        await saveUserData(newUser);
        return newUser;
      }
    } catch (error) {
      console.error('Error loading/creating user profile:', error);
      return null;
    }
  }, []);

  const saveUserData = useCallback(async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener will handle the rest
      return userCredential.user;
    } catch (error) {
      console.error('Firebase sign in error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email, password, fullName) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (fullName && userCredential.user) {
        await updateFirebaseProfile(userCredential.user, {
          displayName: fullName
        });
      }
      
      // Auth state listener will handle the rest
      return userCredential.user;
    } catch (error) {
      console.error('Firebase sign up error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await firebaseSignOut(auth);
      // Auth state listener will handle the rest
    } catch (error) {
      console.error('Error signing out:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const updatedUser = { ...state.user, ...updates };
      
      // Update Firebase profile if name or photo changed
      if (updates.name || updates.avatar) {
        const profileUpdates = {};
        if (updates.name) profileUpdates.displayName = updates.name;
        if (updates.avatar) profileUpdates.photoURL = updates.avatar;
        
        await updateFirebaseProfile(auth.currentUser, profileUpdates);
      }
      
      dispatch({ type: 'UPDATE_USER', payload: updates });
      await saveUserData(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.user, saveUserData]);

  const updatePreferences = useCallback(async (preferences) => {
    try {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      const updatedUser = {
        ...state.user,
        preferences: { ...state.user?.preferences, ...preferences },
      };
      await saveUserData(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating preferences:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.user, saveUserData]);

  const updateStats = useCallback(async (stats) => {
    try {
      const updatedUser = { ...state.user, ...stats };
      dispatch({ type: 'UPDATE_USER', payload: stats });
      await saveUserData(updatedUser);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }, [state.user, saveUserData]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Delete user data from storage
      await AsyncStorage.multiRemove(['userData', 'chats']);
      
      // Delete Firebase account
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Error deleting account:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      // State
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      
      // Auth methods
      signIn,
      signUp,
      signOut,
      
      // Profile methods
      updateProfile,
      updatePreferences,
      updateStats,
      deleteAccount,
      
      // Utility methods
      clearError,
      dispatch,
    }),
    [
      state.user,
      state.isAuthenticated,
      state.isLoading,
      state.error,
      signIn,
      signUp,
      signOut,
      updateProfile,
      updatePreferences,
      updateStats,
      deleteAccount,
      clearError,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get user initials
export const getUserInitials = (user) => {
  if (!user) return 'U';
  if (user.name) {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  return 'U';
};

// Helper function to format user display name
export const getDisplayName = (user) => {
  if (!user) return 'User';
  return user.name || user.email?.split('@')[0] || 'User';
};