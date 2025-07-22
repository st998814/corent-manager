import { useState,useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text ,Button} from 'react-native';
import { StatusBarStyle } from 'react-native';
import { TextInput } from 'react-native';
import NavTabs from './navigation/BottomTabs'
import { Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AppContent /> 
    </ThemeProvider>
  );
}

function AppContent() {
  const { isDarkMode } = useTheme();  
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDarkMode ? '#1a1a1a' : '#8e44ad'
    }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <NavigationContainer>
        <NavTabs  />
      </NavigationContainer>
    </View>
  );
}

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#121212' : '#ffffff',
  },
});

export default App;
