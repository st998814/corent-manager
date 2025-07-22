import React from 'react';


import { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Button,Switch } from 'react-native';
import { StatusBarStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { useTheme } from '../context/ThemeContext';
import { useUserStore } from "../store/useUserStore";



function ProfileScreen() {

      const { theme, isDarkMode, toggleTheme } = useTheme();
    
      const styles = createStyles(isDarkMode);
      const { userId, username, token } = useUserStore((state) => state);

      return (
    <View style={styles.container}>
      {userId ? (
        <>
          <Text style={styles.text}>當前用戶資訊</Text>
          <Text style={styles.text}>ID：{userId}</Text>
          <Text style={styles.text}>名稱：{username}</Text>
          <Text style={styles.text}>Token：{token}</Text>
        </>
      ) : (
        <Text style={styles.text}>尚未登入</Text>
      )}
        <Text style={styles.text}>當前主題: {theme}</Text>
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
    color: isDarkMode?"white":"black",
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
    switch: {
        marginTop: 20,
    },
});
export default ProfileScreen;