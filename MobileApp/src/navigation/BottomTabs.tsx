
// import necessary libraries
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import  custom components
import HomeScreen from '../screens/Dashboard'
import ProfileScreen from '../screens/Profile';
import PaymentScreen from '../screens/Payment';
import RequestScreen from '../screens/Request'; 


import LoginScreen from '../screens/Login';

// import  icon packages 
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



import { useTheme } from '../context/ThemeContext';


const Tab = createBottomTabNavigator();







// Main Tab Navigator
function NavTabs() {
   const { theme, isDarkMode, toggleTheme } = useTheme();

  

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#8e44ad', // color when tab is active
        tabBarInactiveTintColor: 'gray', // color when tab is inactive
        tabBarStyle: {
          // 
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff', // background color of the tab bar
          borderTopColor: isDarkMode ? '#333' : '#ccc', // border color
          borderTopWidth: 1, // border width
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Dashboard', tabBarIcon: ({ color }) => (<MaterialIcons name="dashboard" size={24} color={color} />), headerStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }, headerTintColor: isDarkMode ? '#ffffff' : '#000000' }}
      />
      <Tab.Screen 
        name="Request" 
        component={RequestScreen}
        options={{ tabBarLabel: 'Request', tabBarIcon:({color})=>(<FontAwesome5 name="fist-raised" size={24} color={color} />), headerStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }, headerTintColor: isDarkMode ? '#ffffff' : '#000000' } }
      />
      <Tab.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ tabBarLabel: 'Payment', tabBarIcon:({color})=>(<MaterialIcons name="payments" size={24} color={color} />), headerStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }, headerTintColor: isDarkMode ? '#ffffff' : '#000000' } }
      />
        <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile',  tabBarIcon:({color})=>(<Ionicons name="person-outline" size={24} color={color} />), headerStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }, headerTintColor: isDarkMode ? '#ffffff' : '#000000' } }
      />
        <Tab.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ tabBarLabel: 'Login',  tabBarIcon:({color})=>(<Ionicons name="person-outline" size={24} color={color} />), headerStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }, headerTintColor: isDarkMode ? '#ffffff' : '#000000' } }
      />
    </Tab.Navigator>
  );
}



const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#8e44ad',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});

export default NavTabs;