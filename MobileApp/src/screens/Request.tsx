import React from 'react';
import { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Button } from 'react-native';
import { StatusBarStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { useTheme } from '../context/ThemeContext';



function RequestScreen() {

      const { theme, isDarkMode, toggleTheme } = useTheme();
    
      const styles = createStyles(isDarkMode);
    
  return (
    <View style={styles.container}>
      <Text >Request Screen</Text>
    </View>
  );
}
const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0e7',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});

export default RequestScreen;