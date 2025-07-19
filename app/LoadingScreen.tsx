import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function LoadingScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // User is authenticated, navigate to tabs
      router.replace('/AuthenticatedScreen');
    } else if (user === null) {
      // User is not authenticated, navigate to auth screen
      router.replace('/AuthScreen');
    }
    // user === undefined while auth state is being determined initially
  }, [user, router]);

  // You can render a loading indicator or null while determining auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});