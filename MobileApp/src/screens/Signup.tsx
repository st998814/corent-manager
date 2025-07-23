
import React from 'react';
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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useUserStore } from '../store/useUserStore';
import axios from 'axios';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignupScreen() {
      const [name, createName] = useState('');
      const [email, createEmail] = useState('');
      const [password, createPassword] = useState('');
      const [confirmPassword, createConfirmPassword] = useState('');

      const isLoggedIn = useUserStore((state) => state.isLoggedIn);
      const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
      const setUser = useUserStore((state) => state.setUser);
      const [isLoading, setIsLoading] = useState(false);
      const { theme, isDarkMode, toggleTheme } = useTheme();
      const styles = createStyles(isDarkMode);




    const navigation = useNavigation();

      const handleSignup = async (name: string, email: string, password: string) => {

        try {
                const res = await axios.post("http://192.168.20.12:8080/api/auth/register", {name,
      email,
      password,
    });


            // 3. 跳轉 Login
            // setIsLoggedIn(true);
            Alert.alert("註冊成功", res.data.message);
            navigation.navigate('Login' as never);
    

   
        } catch (error: any) {
      console.error("Signup Error:", error);
        Alert.alert("Signup Error", error.response?.data?.message || "Signup failed");
        setIsLoading(false);

    }
  };
        const handleSubmit = () => {
        setIsLoading(true);

        handleSignup(name,email, password);
        
        //if (!cofirmPassword()) {
        //setIsLoading(false);
        //return;
        //}


    };

    //const cofirmPassword = () => {
    //if (password !== confirmPassword) {
      //Alert.alert("密碼不匹配", "請確認兩次輸入的密碼一致");
      //return false;
    //}
    //return true;


    //};
    //DOM 
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>

        <View style={styles.content}>


          {/* 標題區域 */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>註冊你的共租管理帳號</Text>
          </View>

          

          
  
          {/* 表單區域 */}

          {/* name */}
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>名稱</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={createName}
                    placeholder="輸入你的名稱"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                </View>

          {/* email */}
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>電子郵件</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={createEmail}
                    placeholder="輸入你的電子郵件"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                </View>

    

    
                {/* password */}
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>密碼</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={createPassword}
                    placeholder="輸入你的密碼"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                </View>
          
            {/* confirm password */}
  
            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>確認密碼</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={createConfirmPassword}
                placeholder="確認你的密碼"
                placeholderTextColor={isDarkMode ? '#888' : '#666'}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View> */}
  
            
 
          </View>
  
          {/* 按鈕區域 */}
          <View style={styles.buttonSection}>           
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                {isLoading ? '註冊中...' : '註冊'}
              </Text>
            </TouchableOpacity>


                    <View style={styles.signupSection}>
                      <Text style={styles.signupText}>已有帳號？</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                        <Text style={styles.signupLink}>立即登入</Text>
                      </TouchableOpacity>
                    </View>
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
   
    marginTop: 0,
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
  loginLink: {
    color: isDarkMode ? '#bb86fc' : 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default SignupScreen;