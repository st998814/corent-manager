import { useState,useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text ,Button} from 'react-native';
import { StatusBarStyle } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PortalHost } from '@rn-primitives/portal';



import NavTabs from './navigation/BottomTabs'
import LoginScreen from "./screens/Login";
import axios, { AxiosResponse } from "axios";

import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserStore } from "./store/useUserStore";
//screens
import SignupScreen from './screens/Signup';
import AddMemberScreen from './screens/Group/AddMembers';
import EditProfileScreen from './screens/EditProfile';
import ProfileScreen from './screens/Profile';
import PaymentDetailsScreen from './screens/PaymentDetails';
import RequestDetailsScreen from './screens/Request/RequestDetails';
import JoinGroupScreen from './screens/JoinGroup';
import CreateGroupScreen from './screens/Group/CreateGroup';
import AddRequestScreen from './screens/Request/AddRequest';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



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
       <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Tabs" component={NavTabs} />
              <Stack.Screen name="AddMember" component={AddMemberScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen } />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
              <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} />
              <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
              <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
              <Stack.Screen name="AddRequest" component={AddRequestScreen}/>
            
            </>
          ) : (
            
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />

            </>
            
          )}
        </Stack.Navigator>

      </NavigationContainer>
      </GestureHandlerRootView>
      <PortalHost />
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
