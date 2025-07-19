import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function HomeScreen() {
  const handleLogout = async () => {
    await signOut(auth);
  }
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">Home Screen</Text>
      <TouchableOpacity onPress={handleLogout} className="p-3 bg-red-400 rounded-xl mt-4">
        <Text className="text-white text-lg font-bold">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}