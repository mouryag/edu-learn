import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function SocialLogin() {
  // You would typically include a prop for handling the social login action
  // const handleGoogleSignIn = () => { ... };

  return (
    <View className="flex-row justify-center space-x-12">
      <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
        <Image source={require('../assets/icons/google.png')}
          className="w-10 h-10" />
      </TouchableOpacity>
      {/* Add other social login buttons here if needed */}
    </View>
  );
}