import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome'
import { auth } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'

const { height } = Dimensions.get('window')

export default function LoginScreen() {
  const navigation = useNavigation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please fill in all fields")
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      // Try Firebase auth first
      await signInWithEmailAndPassword(auth, email, password)
      
      // If successful, sign in to our app context
      await signIn(email, password)
      
      // Navigation will be handled automatically by AppNavigation
    } catch (err) {
      console.log('Login error: ', err.message)
      
      // For development - allow any email/password combination
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        try {
          await signIn(email, password)
        } catch (contextError) {
          Alert.alert("Login Failed", "Please check your credentials and try again")
        }
      } else {
        Alert.alert("Login Failed", "Please check your credentials and try again")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      
      <View style={{ flex: 1, backgroundColor: '#4f46e5' }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 pt-4">
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: 12,
                  borderRadius: 16
                }}
              >
                <ArrowLeftIcon size="20" color="white" />
              </TouchableOpacity>
              
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                Welcome Back
              </Text>
              <View style={{ width: 44 }} />
            </View>

            {/* Hero Section */}
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingTop: 20
            }}>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: 20,
                borderRadius: 24,
                marginBottom: 20
              }}>
                <Icon name="graduation-cap" size={60} color="white" />
              </View>
              
              <Text style={{
                color: 'white',
                fontSize: 28,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 8
              }}>
                Continue Learning
              </Text>
              <Text style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 32,
                paddingHorizontal: 16
              }}>
                Sign in to access your personalized AI learning companion
              </Text>
            </View>
          </SafeAreaView>

          {/* Login Form */}
          <View style={{
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            minHeight: height * 0.55,
            backgroundColor: '#ffffff',
            paddingHorizontal: 24,
            paddingTop: 32
          }}>
            <View style={{ gap: 20 }}>
              {/* Email Input */}
              <View>
                <Text style={{
                  color: '#374151',
                  marginLeft: 8,
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Email Address
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: emailFocused ? '#eff6ff' : '#f9fafb',
                  borderWidth: 2,
                  borderColor: emailFocused ? '#3b82f6' : 'transparent'
                }}>
                  <Icon 
                    name="envelope" 
                    size={20} 
                    color={emailFocused ? '#3b82f6' : '#a1a1aa'} 
                    style={{ marginRight: 12 }} 
                  />
                  <TextInput 
                    style={{
                      flex: 1,
                      color: '#374151',
                      fontSize: 16
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  {email.length > 0 && isValidEmail(email) && (
                    <Icon name="check-circle" size={20} color="#10b981" />
                  )}
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text style={{
                  color: '#374151',
                  marginLeft: 8,
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Password
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: passwordFocused ? '#eff6ff' : '#f9fafb',
                  borderWidth: 2,
                  borderColor: passwordFocused ? '#3b82f6' : 'transparent'
                }}>
                  <Icon 
                    name="lock" 
                    size={20} 
                    color={passwordFocused ? '#3b82f6' : '#a1a1aa'} 
                    style={{ marginRight: 12 }} 
                  />
                  <TextInput 
                    style={{
                      flex: 1,
                      color: '#374151',
                      fontSize: 16
                    }}
                    secureTextEntry={!showPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    autoComplete="password"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ padding: 4 }}
                  >
                    <Icon 
                      name={showPassword ? "eye-slash" : "eye"} 
                      size={20} 
                      color="#a1a1aa" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  color: '#2563eb',
                  fontSize: 16,
                  fontWeight: '500'
                }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                style={{
                  paddingVertical: 16,
                  borderRadius: 16,
                  backgroundColor: isLoading ? '#9ca3af' : '#3b82f6'
                }}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white'
                }}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
              marginBottom: 20
            }}>
              <Text style={{
                color: '#6b7280',
                fontWeight: '500',
                fontSize: 16
              }}>
                Don't have an account? 
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{
                  fontWeight: 'bold',
                  color: '#2563eb',
                  fontSize: 16,
                  marginLeft: 4
                }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}