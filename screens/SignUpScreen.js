import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
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
import { auth } from '../firebaseConfig'
  
  const { height, width } = Dimensions.get('window')
  
  export default function SignUpScreen() {
    const navigation = useNavigation()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [nameFocused, setNameFocused] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const scaleAnim = useRef(new Animated.Value(0.9)).current
    const floatingIcons = useRef([
      new Animated.Value(0),
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
        createFloatingAnimation(anim, index * 800).start()
      })
    }, [])
  
    const handleSubmit = async () => {
      if (!fullName || !email || !password || !confirmPassword) {
        Alert.alert("Missing Information", "Please fill in all fields")
        return
      }
  
      if (!isValidEmail(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address")
        return
      }
  
      if (password.length < 6) {
        Alert.alert("Weak Password", "Password should be at least 6 characters")
        return
      }
  
      if (password !== confirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match")
        return
      }
  
      setIsLoading(true)
      try {
        await createUserWithEmailAndPassword(auth, email, password)
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
        console.log('SignUp error: ', err.message)
        let errorMessage = "Registration failed. Please try again."
        
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already registered. Please use a different email."
        } else if (err.code === 'auth/weak-password') {
          errorMessage = "Password should be at least 6 characters."
        }
        
        Alert.alert("Registration Failed", errorMessage)
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
                  Join Our Community
                </Text>
                <View style={{ width: 44 }} />
              </View>
  
              {/* Floating Learning Icons */}
              <FloatingIcon animValue={floatingIcons[0]} style={{ top: 80, right: 30 }}>
                <Icon name="graduation-cap" size={25} color="rgba(255,255,255,0.6)" />
              </FloatingIcon>
              <FloatingIcon animValue={floatingIcons[1]} style={{ top: 140, left: 40 }}>
                <Icon name="book" size={22} color="rgba(255,255,255,0.6)" />
              </FloatingIcon>
              <FloatingIcon animValue={floatingIcons[2]} style={{ top: 100, right: 80 }}>
                <Icon name="lightbulb-o" size={24} color="rgba(255,255,255,0.6)" />
              </FloatingIcon>
              <FloatingIcon animValue={floatingIcons[3]} style={{ top: 160, right: 120 }}>
                <Icon name="star" size={20} color="rgba(255,255,255,0.6)" />
              </FloatingIcon>
  
              {/* Hero Section */}
              <Animated.View 
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 24,
                  paddingTop: 20,
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }}
              >
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: 20,
                  borderRadius: 24,
                  marginBottom: 20
                }}>
                  <Image 
                    source={require('../assets/images/signupimg.png')} 
                    style={{ width: 100, height: 80, borderRadius: 16 }}
                  />
                </View>
                
                <Text style={{
                  color: 'white',
                  fontSize: 26,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  Start Your Journey
                </Text>
                <Text style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 15,
                  textAlign: 'center',
                  marginBottom: 24,
                  paddingHorizontal: 16
                }}>
                  Create your account and unlock personalized learning experiences
                </Text>
              </Animated.View>
            </SafeAreaView>
  
            {/* SignUp Form */}
            <Animated.View 
              style={{
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                minHeight: height * 0.65,
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
              <View style={{ gap: 20 }}>
                {/* Full Name Input */}
                <View>
                  <Text style={{
                    color: '#374151',
                    marginLeft: 8,
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 8
                  }}>
                    Full Name
                  </Text>
                  <View 
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 16,
                      backgroundColor: nameFocused ? '#eff6ff' : '#f9fafb',
                      borderWidth: 2,
                      borderColor: nameFocused ? '#3b82f6' : 'transparent',
                      shadowColor: nameFocused ? '#3b82f6' : '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: nameFocused ? 0.1 : 0.05,
                      shadowRadius: 8,
                      elevation: nameFocused ? 4 : 2
                    }}
                  >
                    <Icon 
                      name="user" 
                      size={20} 
                      color={nameFocused ? '#3b82f6' : '#a1a1aa'} 
                      style={{ marginRight: 12 }} 
                    />
                    <TextInput 
                      style={{
                        flex: 1,
                        color: '#374151',
                        fontSize: 16
                      }}
                      placeholder="Enter your full name"
                      placeholderTextColor="#9ca3af"
                      value={fullName}
                      onChangeText={setFullName}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                    {fullName.length > 2 && (
                      <Icon name="check-circle" size={20} color="#10b981" />
                    )}
                  </View>
                </View>
  
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
                      placeholder="Create a password"
                      placeholderTextColor="#9ca3af"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      autoComplete="password-new"
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
                  {password.length > 0 && password.length < 6 && (
                    <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 8 }}>
                      Password must be at least 6 characters
                    </Text>
                  )}
                </View>
  
                {/* Confirm Password Input */}
                <View>
                  <Text style={{
                    color: '#374151',
                    marginLeft: 8,
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 8
                  }}>
                    Confirm Password
                  </Text>
                  <View 
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 16,
                      backgroundColor: confirmPasswordFocused ? '#eff6ff' : '#f9fafb',
                      borderWidth: 2,
                      borderColor: confirmPasswordFocused ? '#3b82f6' : 'transparent',
                      shadowColor: confirmPasswordFocused ? '#3b82f6' : '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: confirmPasswordFocused ? 0.1 : 0.05,
                      shadowRadius: 8,
                      elevation: confirmPasswordFocused ? 4 : 2
                    }}
                  >
                    <Icon 
                      name="lock" 
                      size={20} 
                      color={confirmPasswordFocused ? '#3b82f6' : '#a1a1aa'} 
                      style={{ marginRight: 12 }} 
                    />
                    <TextInput 
                      style={{
                        flex: 1,
                        color: '#374151',
                        fontSize: 16
                      }}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="Confirm your password"
                      placeholderTextColor="#9ca3af"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      autoComplete="password-new"
                    />
                    <TouchableOpacity 
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ padding: 4 }}
                    >
                      <Icon 
                        name={showConfirmPassword ? "eye-slash" : "eye"} 
                        size={20} 
                        color="#a1a1aa" 
                      />
                    </TouchableOpacity>
                  </View>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 8 }}>
                      Passwords do not match
                    </Text>
                  )}
                </View>
  
                {/* Sign Up Button */}
                <TouchableOpacity 
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                    shadowColor: '#3b82f6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    marginTop: 8
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
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>
              </View>
  
              {/* Social Login */}
              <View style={{ marginTop: 24 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20
                }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }} />
                  <Text style={{
                    marginHorizontal: 16,
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    or sign up with
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
  
              {/* Login Link */}
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
                  Already have an account? 
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: '#2563eb',
                    fontSize: 16,
                    marginLeft: 4
                  }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    )
  }