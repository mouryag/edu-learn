import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated'; // Make sure this import is here if you're using reanimated
import { useEffect, useState } from 'react';

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth, AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider
import LoadingScreen from "./LoadingScreen"; // Import LoadingScreen

export default function RootLayout() {
 return (
    <AuthProvider>
 <RootLayoutContent />
    </AuthProvider>
 );
}

function RootLayoutContent() {
  // Call Hooks unconditionally at the top level
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // This check is fine as it returns null, which doesn't change the order of Hooks
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}> {/* Single Stack at the root */}
        <Stack.Screen name="LoadingScreen" /> {/* Make LoadingScreen the initial route */}
        {/* Keep other Stack.Screen components if needed, e.g., not-found */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" /> {/* This should probably be outside the Stack */}
    </ThemeProvider>
  );
}
