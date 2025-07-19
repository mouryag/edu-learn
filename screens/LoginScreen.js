import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Image,
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

const { height, width } = Dimensions.get('window')

export default function LoginScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const floatingIcons = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start()

    // Floating animation for learning icons
    const createFloatingAnimation = (animValue, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          })
        ])
      )
    }

    floatingIcons.forEach((anim, index) => {
      createFloatingAnimation(anim, index * 1000).start()
    })
  }, [])

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
      await signInWithEmailAndPassword(auth, email, password)
      // Success feedback
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }).start()
      })
    } catch (err) {
      console.log('Login error: ', err.message)
      Alert.alert("Login Failed", "Please check your credentials and try again")
    } finally {
      setIsLoading(false)
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const FloatingIcon = ({ children, animValue, style }) => (
    <Animated.View
      style={[
        {
          position: 'absolute',
          opacity: animValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 0.8, 0.3]
          }),
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20]
              })
            },
            {
              scale: animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.2, 0.8]
              })
            }
          ]
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  )

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      
      {/* Background with solid colors instead of gradient */}
      <View style={{ 
        flex: 1, 
        backgroundColor: '#4f46e5' // Primary purple color
      }}>
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
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }}
              >
                <ArrowLeftIcon size="20" color="white" />
              </TouchableOpacity>
              
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                Welcome Back
              </Text>
              <View style={{ width: 44 }} />
            </View>

            {/* Floating Learning Icons */}
            <FloatingIcon animValue={floatingIcons[0]} style={{ top: 100, right: 30 }}>
              <Icon name="graduation-cap" size={30} color="rgba(255,255,255,0.6)" />
            </FloatingIcon>
            <FloatingIcon animValue={floatingIcons[1]} style={{ top: 180, left: 40 }}>
              <Icon name="book" size={25} color="rgba(255,255,255,0.6)" />
            </FloatingIcon>
            <FloatingIcon animValue={floatingIcons[2]} style={{ top: 140, right: 80 }}>
              <Icon name="lightbulb-o" size={28} color="rgba(255,255,255,0.6)" />
            </FloatingIcon>

            {/* Hero Section */}
            <Animated.View 
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 24,
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }}
            >
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: 24,
                borderRadius: 24,
                marginBottom: 24
              }}>
                <Image 
                  source={require('../assets/images/loginimg.png')} 
                  style={{ width: 120, height: 120, borderRadius: 16 }}
                />
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
                Your personalized AI companion is waiting to help you achieve your goals
              </Text>
            </Animated.View>
          </SafeAreaView>

          {/* Login Form */}
          <Animated.View 
            style={{
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              minHeight: height * 0.55,
              backgroundColor: '#ffffff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 12,
              paddingHorizontal: 24,
              paddingTop: 32,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View style={{ gap: 24 }}>
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
                <View 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: emailFocused ? '#eff6ff' : '#f9fafb',
                    borderWidth: 2,
                    borderColor: emailFocused ? '#3b82f6' : 'transparent',
                    shadowColor: emailFocused ? '#3b82f6' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: emailFocused ? 0.1 : 0.05,
                    shadowRadius: 8,
                    elevation: emailFocused ? 4 : 2
                  }}
                >
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
                <View 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: passwordFocused ? '#eff6ff' : '#f9fafb',
                    borderWidth: 2,
                    borderColor: passwordFocused ? '#3b82f6' : 'transparent',
                    shadowColor: passwordFocused ? '#3b82f6' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: passwordFocused ? 0.1 : 0.05,
                    shadowRadius: 8,
                    elevation: passwordFocused ? 4 : 2
                  }}
                >
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
                  backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
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

            {/* Social Login */}
            <View style={{ marginTop: 32 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24
              }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }} />
                <Text style={{
                  marginHorizontal: 16,
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  or continue with
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }} />
              </View>
              
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 16
              }}>
                <TouchableOpacity 
                  style={{
                    padding: 16,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  <Image 
                    source={require('../assets/icons/google.png')} 
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{
                    padding: 16,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  <Icon name="apple" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{
                    padding: 16,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  <Icon name="facebook" size={24} color="#1877f2" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 32,
              marginBottom: 24
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
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}