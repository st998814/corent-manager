import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

 import AsyncStorage from '@react-native-async-storage/async-storage';

 import SignupScreen from './Signup';

import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/useUserStore';
import { API_URLS } from '../config/api';





export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
 
  const styles = createStyles(isDarkMode);

  const navigation = useNavigation();


  const handleLogin = async (email: string, password: string) => {
  try {
    console.log('🔄 嘗試登入，使用 API URL:', API_URLS.LOGIN);
    
    const res = await axios.post(API_URLS.LOGIN, {
      email,
      password,
    });

    console.log('✅ 登入成功，回應:', res.data);

    // 1. 存 Token 到本地
    await AsyncStorage.setItem("token", res.data.token);
    console.log("💾 已保存 token:", res.data.token);

    // 2. 更新全局狀態（Zustand）
    const setUser = useUserStore.getState().setUser;
    setUser(res.data.user.id, res.data.user.username, res.data.token);

    // 3. 跳轉 Dashboard
    
    //  navigation.navigate("Dashboard" as never);

    // setIsLoading(false);
    setIsLoading(false);
    setIsLoggedIn(true); // 更新登入狀態
    Alert.alert("登入成功", "歡迎回來！");

  } catch (error: any) {
    console.log("❌ 登入錯誤 - 詳細信息:", JSON.stringify(error, null, 2));
    console.log("🌐 使用的 API URL:", API_URLS.LOGIN);
    
    let errorMessage = "登入失敗";
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network')) {
      errorMessage = "網路連線錯誤，請檢查網路連線或聯繫開發人員";
    } else if (error.response?.status === 404) {
      errorMessage = "API 端點不存在，請檢查伺服器設定";
    } else if (error.response?.status === 500) {
      errorMessage = "伺服器內部錯誤";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    Alert.alert(
      "登入失敗",
      errorMessage
    );
    setIsLoading(false);
  }
  };



  const handleSubmit = () => {
    setIsLoading(true);

    handleLogin(email, password);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'This feature is under development.');
  };    


  //DOM 
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.content}>
        {/* 標題區域 */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>歡迎回來</Text>
          <Text style={styles.subtitle}>登入你的共租管理帳號</Text>
        </View>

        {/* 表單區域 */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>電子郵件</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="輸入你的電子郵件"
              placeholderTextColor={isDarkMode ? '#888' : '#666'}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>密碼</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="輸入你的密碼"
              placeholderTextColor={isDarkMode ? '#888' : '#666'}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* 忘記密碼連結 */}
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>忘記密碼？</Text>
          </TouchableOpacity>
        </View>

        {/* 按鈕區域 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '登入中...' : '登入'}
            </Text>
          </TouchableOpacity>

          {/* 快速登入按鈕（測試用） */}
          {/* <TouchableOpacity
            style={styles.quickLoginButton}
            onPress={() => {
              setEmail('test@example.com');
              setPassword('password123');
            }}
          >
            <Text style={styles.quickLoginText}>使用測試帳號</Text>
          </TouchableOpacity> */}
        </View>

        {/* 註冊提示 */}
        <View style={styles.signupSection}>
          <Text style={styles.signupText}>還沒有帳號？</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup' as never)}>
            <Text style={styles.signupLink}>立即註冊</Text>
          </TouchableOpacity>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0e7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color:  isDarkMode?"white":"black",
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: isDarkMode ? '#bbbbbb' : '#f0f0f0',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color:  isDarkMode ? '#1a1a1a' : '#f0f0e7',
    marginBottom: 8,
  },
  input: {
    backgroundColor: isDarkMode ? '#2d2d2d' : 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: isDarkMode ? '#444' : 'rgba(255, 255, 255, 0.3)',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: isDarkMode ? '#bb86fc' : '#f0f0f0',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonSection: {
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: isDarkMode ? '#bb86fc' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: isDarkMode ? '#121212' : '#8e44ad',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickLoginButton: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: isDarkMode ? '#bbbbbb' : '#f0f0f0',
    fontSize: 16,
    marginRight: 5,
  },
  signupLink: {
    color: isDarkMode ? '#bb86fc' : 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
