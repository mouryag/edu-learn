import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { themeColors } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Adjust the path if necessary

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [error, setError] = useState<string | null>(null); // State for error messages
    const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

    const handleSubmit = async () => {
        setError(null); // Clear previous errors
        setLoading(true);

        if (email && password && confirmPassword) {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            try {
                // Create user with email and password
                await createUserWithEmailAndPassword(auth, email, password);

                // Automatically sign in the user after successful sign-up
                await signInWithEmailAndPassword(auth, email, password);

                // Navigate to the authenticated screen on success
                navigation.navigate('AuthenticatedScreen' as never); // Use 'as never' to bypass type checking if needed

            } catch (e: any) {
                // Handle specific Firebase authentication errors
                if (e.code === 'auth/email-already-in-use') {
                    setError('That email address is already in use!');
                } else if (e.code === 'auth/weak-password') {
                    setError('Password should be at least 6 characters');
                } else {
                    setError('Sign-up failed: ' + e.message);
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
        <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4" >
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <Image source={require('../assets/images/signupimg.png')}
                        style={{ width: 325, height: 110 }} />
                </View>
            </SafeAreaView>
            <View className="flex-1 bg-white px-8 pt-8"
                style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }} >
                <View className="form space-y-2">
                    <Text className="text-gray-700 ml-4">Full Name</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                        placeholder='Enter Name'
                    // You might want a separate state for full name if needed for user profile
                    />
                    <Text className="text-gray-700 ml-4">Email Address</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                        value={email}
                        onChangeText={value => setEmail(value)}
                        placeholder='Enter Email'
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text className="text-gray-700 ml-4">Password</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" // Adjusted margin bottom
                        secureTextEntry
                        value={password}
                        onChangeText={value => setPassword(value)}
                        placeholder='Enter Password'
                    />
                    {/* New TextInput for Confirm Password */}
                    <Text className="text-gray-700 ml-4">Confirm Password</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7" // Adjusted margin bottom
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={value => setConfirmPassword(value)}
                        placeholder='Confirm Password'
                    />
                    {/* Display error message */}
                    {error && <Text className="text-red-600 ml-4">{error}</Text>}

                    <TouchableOpacity
                        className="py-3 bg-blue-500 rounded-xl"
                        onPress={handleSubmit}
                        disabled={loading} // Disable button while loading
                    >
                        <Text className="font-xl font-bold text-center text-white">
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-xl text-gray-700 font-bold text-center py-5">
                    Or
                </Text>
                <View className="flex-row justify-center space-x-12">
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image source={require('../assets/icons/google.png')}
                            className="w-10 h-10" />
                    </TouchableOpacity>

                </View>
                <View className="flex-row justify-center mt-7">
                    <Text className="text-gray-500 font-semibold">Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                        <Text className="font-semibold text-blue-500"> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { themeColors } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword }