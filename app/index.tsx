import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function LandingScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('/AuthScreen');
  };

  const handleSignUpPress = () => {
    router.push('/AuthScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to My App!</Text>
      <Button mode="contained" onPress={handleLoginPress} style={styles.button}>
        Login
      </Button>
      <Button mode="outlined" onPress={handleSignUpPress} style={styles.button}>
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    width: '80%',
  },
});