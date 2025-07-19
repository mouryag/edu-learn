import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../theme'; // Assuming themeColors is in ../theme

interface AuthHeaderProps {
  navigation: any; // Replace 'any' with the appropriate navigation type if possible
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex">
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          style={{ backgroundColor: themeColors.yellow_300 }} // Example usage of themeColors
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center">
        <Image
          source={require('../assets/images/loginimg.png')} // Adjust path if needed
          style={{ width: 220, height: 200 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default AuthHeader;