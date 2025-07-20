import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

// Import contexts
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ChatProvider } from '../contexts/ChatContext';

const Stack = createNativeStackNavigator();

// Main navigation component
function AppNavigator() {
  const { user, loading } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <ActivityIndicator size="large" color="#e97a47" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }}
      >
        {user ? (
          // User is authenticated - show main app
          <Stack.Screen name="Home" component={HomeScreenWithChat} />
        ) : (
          // User is not authenticated - show auth screens
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen}
              options={{ 
                animationTypeForReplace: 'pop',
              }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                title: 'Sign In',
                animation: 'slide_from_right'
              }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen}
              options={{
                title: 'Sign Up',
                animation: 'slide_from_right'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrap HomeScreen with ChatProvider for authenticated users
function HomeScreenWithChat() {
  return (
    <ChatProvider>
      <HomeScreen />
    </ChatProvider>
  );
}

// Root App component with AuthProvider
export default function AppNavigation() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}