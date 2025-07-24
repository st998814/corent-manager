import React from 'react';


import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatusBar, StyleSheet, View, Text, Button, Switch, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBarStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '../context/ThemeContext';
import { useUserStore } from "../store/useUserStore";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from '../components/PrimaryButton';
import EditProfileScreen from './EditProfile';




function ProfileScreen() {

    const { theme, isDarkMode, toggleTheme } = useTheme();
      
      
    const { userId, username, token } = useUserStore((state) => state);
    const [userDetails, setUserDetails] = useState({ name:"",email: '', avatarUrl: '' });

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://192.168.20.12:8080/api/auth/me', {
            headers: {
              authorization: `Bearer ${token}`
            }
          });


          setUserDetails({
                name : response.data.user.name ,

                email: response.data.user.email,
                avatarUrl: response.data.user.avatarUrl || ""
              });

        } catch (error) {
          console.error('Error fetching user data:', error);
          if (error.response?.status === 401) {
            await AsyncStorage.removeItem("token");
            clearUser();
            setIsLoggedIn(false);
            navigation.navigate("Login" as never);
          }
        }
      };

      if (token) {
        fetchUserData();
      }
    }, [token]);




    const navigation = useNavigation();
    const clearUser = useUserStore((state) => state.clearUser);
    const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
    const styles = createStyles(isDarkMode);


    const handleLogout = async () => {
     await AsyncStorage.removeItem("token");

     clearUser();
     setIsLoggedIn(false);
      navigation.navigate("Login" as never);
    };

    return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userDetails.avatarUrl || "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userDetails.name || 'Guest'}</Text>
          <Text style={styles.userEmail}>{userDetails.email || userId}</Text>
        </View>
      </View>

      {/* Settings List */}
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditProfile' as never)}>
          <Ionicons name="person-outline" size={20} color={isDarkMode ? '#fff' : '#666'} />
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="moon-outline" size={20} color={isDarkMode ? '#fff' : '#666'} />
          <View style={styles.themeToggle}>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
              trackColor={{ true: '#444', false: '#eaeaea' }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={20} color={isDarkMode ? '#fff' : '#666'} />
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="lock-closed-outline" size={20} color={isDarkMode ? '#fff' : '#666'} />
          <Text style={styles.settingText}>Security</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionCard}>
        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff4444" />
          <Text style={[styles.actionText, {color: '#ff4444'}]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginTop: 25,
    marginBottom: 8,
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 1, // Android 陰影
    shadowColor: "#000", // iOS 陰影
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileInfo: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 15,
  },
  logoutButton: {
    alignItems: "center",
    marginVertical: 30,
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    fontWeight: "500",
  },
});
    
export default ProfileScreen;

    function createStyles(isDarkMode: boolean) {
      return StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: isDarkMode ? "#181818" : "#fff",
          paddingHorizontal: 16,
        },
        header: {
          marginTop: 20,
          marginBottom: 10,
        },
        profileHeader: {
          alignItems: 'center',
          paddingVertical: 32,
        },
        avatar: {
          width: 100,
          height: 100,
          borderRadius: 50,
          marginBottom: 16,
        },
        sectionTitle: {
          marginTop: 25,
          marginBottom: 8,
          fontSize: 14,
          color: isDarkMode ? "#bbb" : "#888",
          fontWeight: "500",
        },
  settingsCard: {
    backgroundColor: isDarkMode ? "#232323" : "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  actionCard: {
    backgroundColor: isDarkMode ? "#232323" : "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? "#333" : "#eee",
  },
  themeToggle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: isDarkMode ? "#fff" : "#181818",
    marginLeft: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 16,
  },
        profileRow: {
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? "#333" : "#eee",
        },
        profileInfo: {
          flexDirection: "column",
        },
        userName: {
          fontSize: 16,
          fontWeight: "600",
          color: isDarkMode ? "#fff" : "#181818",
        },
        userEmail: {
          fontSize: 14,
          color: isDarkMode ? "#bbb" : "#888",
        },
        menuItem: {
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? "#333" : "#eee",
        },
        menuText: {
          fontSize: 15,
          color: isDarkMode ? "#fff" : "#181818",
        },
        logoutButton: {
          alignItems: "center",
          marginVertical: 30,
        },
        logoutText: {
          fontSize: 16,
          color: "red",
          fontWeight: "500",
        },
      });
    }
