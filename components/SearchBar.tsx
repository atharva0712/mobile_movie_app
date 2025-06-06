import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

interface Props {
    onPress: () => void
    placeholder?: string
    value?: string
    onChangeText?: (text: string) => void;
}
const SearchBar = ( {onPress, placeholder, value, onChangeText} : Props) => {
  return (
        <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
          <Image
            source={icons.search}
            style={{ width: 20, height: 20, tintColor: '#ab8bff' }}
            resizeMode="contain"
          />
          <TextInput
            onPress={onPress}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#a8b5db"
            className="flex-1 ml-2 text-white"
          />
        </View>
  )
}

export default SearchBar