import { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Button } from 'react-native';
import { StatusBarStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { useTheme } from '../context/ThemeContext';


function HomeScreen() {
 

    
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
      
      <Text style={styles.text}>Hello World</Text>
      <Text style={styles.text}>當前主題: {theme}</Text>
      <Text style={styles.text}>暗黑模式: {isDarkMode ? '開啟' : '關閉'}</Text>
      
      <Button 
        title={`切換到 ${isDarkMode ? '明亮' : '暗黑'} 模式`}
        onPress={toggleTheme}
      />
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

export default HomeScreen;
