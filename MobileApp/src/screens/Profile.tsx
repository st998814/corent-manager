import React from 'react';


import { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Button, Switch, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBarStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '../context/ThemeContext';
import { useUserStore } from "../store/useUserStore";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from '../components/PrimaryButton';



function ProfileScreen() {

    const { theme, isDarkMode, toggleTheme } = useTheme();
      
      
    const { userId, username, token } = useUserStore((state) => state);

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
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      {/* Settings 區域 */}
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: "https://via.placeholder.com/60" }} // 可換成用戶頭像
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Steven Wang</Text>
            <Text style={styles.userEmail}>st998814@gmail.com</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Scan code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Splitwise Pro</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences 區域 */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Security</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback 區域 */}
      <Text style={styles.sectionTitle}>Feedback</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Rate Splitwise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Contact us</Text>
        </TouchableOpacity>
      </View>

      {/* 登出 */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "600",
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
        headerTitle: {
          fontSize: 26,
          fontWeight: "600",
          color: isDarkMode ? "#fff" : "#181818",
        },
        sectionTitle: {
          marginTop: 25,
          marginBottom: 8,
          fontSize: 14,
          color: isDarkMode ? "#bbb" : "#888",
          fontWeight: "500",
        },
        card: {
          backgroundColor: isDarkMode ? "#232323" : "#fff",
          borderRadius: 8,
          overflow: "hidden",
          elevation: 1,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 3,
          marginBottom: 10,
        },
        profileRow: {
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? "#333" : "#eee",
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

