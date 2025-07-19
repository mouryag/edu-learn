import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface SignUpLinkProps {
  navigation: NavigationProp<any>;
}

const SignUpLink: React.FC<SignUpLinkProps> = ({ navigation }) => {
  return (
    <View className="flex-row justify-center mt-7">
      <Text className="text-gray-500 font-semibold">
        Don't have an account?
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
        <Text className="font-semibold text-blue-500"> Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpLink;