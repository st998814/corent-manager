import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function ReturnButton() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleGoBack}>
      <Ionicons name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#000'} />
    </TouchableOpacity>
  );
}