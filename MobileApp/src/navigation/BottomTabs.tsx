import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EditProfileScreen from '../screens/EditProfile';
import HomeScreen from '../screens/Dashboard';
import ProfileScreen from '../screens/Profile';
import PaymentScreen from '../screens/Payment';
import RequestScreen from '../screens/Request';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export type PaymentItem = {
  id: string;
  title: string;
  amount: number;
  dueDate?: string;
  status: string;
  description?: string;
};

export type RequestItem = {
  id: string;
  type: string;
  description?: string;
  status: string;
};

export type RootStackParamList = {
  AddPayment: undefined;
  PaymentDetails: { paymentData: PaymentItem };
  AddRequest: undefined;
  RequestDetails: { requestData: RequestItem };
};

function NavTabs() {
  const { isDarkMode } = useTheme();


  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        tabBarActiveTintColor: '#8e44ad',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderTopColor: isDarkMode ? '#333' : '#ccc',
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen 
        name="Groups"
        component={HomeScreen}
        options={{ 
          tabBarLabel: 'Groups',
          tabBarIcon: ({ color }) => (<MaterialIcons name="dashboard" size={24} color={color} />),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Request" 
        component={RequestScreen}
        options={{ 
          tabBarLabel: 'Request',
          tabBarIcon: ({ color }) => (<FontAwesome5 name="fist-raised" size={24} color={color} />),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ 
          tabBarLabel: 'Payment',
          tabBarIcon: ({ color }) => (<MaterialIcons name="payments" size={24} color={color} />),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (<Ionicons name="person-outline" size={24} color={color} />),
          headerShown: false,
        }}
      />

    
    </Tab.Navigator>
  );
}

export default NavTabs;
