import { View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView, Dimensions, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email,setEmail] = useState ('');
  const [password,setPassword] = useState ('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.log('got error: ', err.message);
        Alert.alert("Error", err.message);
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: themeColors.bg, paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
      <SafeAreaView  className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={()=> navigation.goBack()} 
          className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View  className="flex-row justify-center my-4">
          <Image source={require('../assets/images/loginimg.png')} 
          style={{width: 200, height: 200}} />
        </View>
      </SafeAreaView>
      <View 
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50, minHeight: height * 0.6, paddingHorizontal: Platform.OS === 'ios' ? 20 : 10}} 
        className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-4">
            <Text className="text-gray-700 ml-4 text-lg">Email Address</Text>
            <View className="flex-row items-center p-4 bg-gray-100 rounded-2xl">
              <Icon name="envelope" size={20} color="#a1a1aa" style={{marginRight: 10}} />
              <TextInput 
                className="flex-1 text-gray-700"
                placeholder="Enter Email"
                keyboardType="email-address"
                value={email}
                onChangeText={value=> setEmail(value)}
              />
            </View>
            <Text className="text-gray-700 ml-4 text-lg">Password</Text>
            <View className="flex-row items-center p-4 bg-gray-100 rounded-2xl">
              <Icon name="lock" size={20} color="#a1a1aa" style={{marginRight: 10}} />
              <TextInput 
                className="flex-1 text-gray-700"
                secureTextEntry
                placeholder="Enter Password"
                value={password}
                onChangeText={value=> setPassword(value)}
              />
            </View>
            <TouchableOpacity className="flex items-end">
              <Text className="text-blue-600 mb-5 text-base">Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="py-3 bg-yellow-400 rounded-xl shadow elevation-3"
              onPress={handleSubmit}
              >
                <Text 
                    className="text-xl font-bold text-center text-gray-700"
                >
                        Login
                </Text>
             </TouchableOpacity>
            
          </View>
          <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>
          <View className="flex-row justify-center space-x-6">
            <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/google.png')} className="w-8 h-8" />
            </TouchableOpacity>
             <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/google.png')} className="w-8 h-8" />
            </TouchableOpacity>
             <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/google.png')} className="w-8 h-8" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-7">
              <Text className="text-gray-500 font-semibold">
                  Don't have an account?
              </Text>
              <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                  <Text className="font-semibold text-yellow-400"> Sign Up</Text>
              </TouchableOpacity>
          </View>
          
      </View>
    </ScrollView>
  )
}