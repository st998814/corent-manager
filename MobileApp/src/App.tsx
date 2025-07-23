import { useState,useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text ,Button} from 'react-native';
import { StatusBarStyle } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


import NavTabs from './navigation/BottomTabs'
import LoginScreen from "./screens/Login";
import axios, { AxiosResponse } from "axios";

import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserStore } from "./store/useUserStore";
import SignupScreen from './screens/Signup';
import AddMemberScreen from './screens/AddMembers';
const Stack = createNativeStackNavigator();

function App() {


  return (
    <ThemeProvider>
      <AppContent /> 
    </ThemeProvider>
  );
}

function AppContent() {

  const { isDarkMode } = useTheme();  
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const setUser = useUserStore((state) => state.setUser);


  useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem("token"); 
    console.log("Stored token:", token);
    
    if (token) {
      try {
        const res = await axios.get("http://192.168.20.12:8080/api/auth/me", {
          headers: {
            'Content-Type': 'application/json',
           'Authorization': 'Bearer '+ token
          },
        });

        const user = res.data.user;

        setUser(user.id, user.username, token); 
        

        setIsLoggedIn(true); 
      } catch (error) {
        console.log("Token Invalid:", error);
        setIsLoggedIn(false); 
      }
    }
    setLoading(false); 
  };

  checkToken();
}, []);



  if (loading) return null;
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDarkMode ? '#1a1a1a' : '#8e44ad'
    }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Dashboard" component={NavTabs} />
              <Stack.Screen name="AddMember" component={AddMemberScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>

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
