import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Adjust the path if necessary
import { useNavigation } from '@react-navigation/native';

const LoginForm = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Navigate to authenticated screen
                navigation.navigate('AuthenticatedScreen' as never); // Use 'as never' to bypass type checking if needed

            } catch (e: any) {
                // Handle specific Firebase authentication errors
                if (e.code === 'auth/invalid-email') {
                    setError('Invalid email address format.');
                } else if (e.code === 'auth/user-disabled') {
                    setError('User account has been disabled.');
                } else if (e.code === 'auth/user-not-found') {
                    setError('User not found. Please sign up.');
                } else if (e.code === 'auth/wrong-password') {
                    setError('Incorrect password.');
                } else {
                    setError('Login failed: ' + e.message);
                }
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please fill in all fields');
            setLoading(false);
        }
    }

    return (
        <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                secureTextEntry
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity className="flex items-end">
                <Text className="text-gray-700 mb-5">Forgot Password?</Text>
            </TouchableOpacity>
            {error && <Text className="text-red-600 ml-4">{error}</Text>}

            <TouchableOpacity
                className="py-3 bg-blue-500 rounded-xl"
                onPress={handleLogin}
                disabled={loading}
            >
                <Text
                    className="text-xl font-bold text-center text-white"
                >
                    {loading ? 'Logging In...' : 'Login'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginForm;