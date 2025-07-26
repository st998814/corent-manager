import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeStore } from '../store/useThemeStore';

type RootStackParamList = {
  SmsVerification: {
    phone: string;
    inviteToken?: string;
    isJoiningGroup?: boolean;
  };
  SetupProfile: {
    phone: string;
    inviteToken?: string;
  };
  Dashboard: undefined;
};

type SmsVerificationRouteProp = RouteProp<RootStackParamList, 'SmsVerification'>;
type SmsVerificationNavigationProp = StackNavigationProp<RootStackParamList, 'SmsVerification'>;

const SmsVerification: React.FC = () => {
  const route = useRoute<SmsVerificationRouteProp>();
  const navigation = useNavigation<SmsVerificationNavigationProp>();
  const { phone, inviteToken, isJoiningGroup = false } = route.params;
  
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRef = useRef<TextInput>(null);
  const styles = createStyles(isDarkMode);

  useEffect(() => {
    // 自動聚焦輸入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    // 倒計時
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('錯誤', '請輸入6位數驗證碼');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          verificationCode,
          inviteToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 驗證成功，導向個人資料設置頁面
        navigation.navigate('SetupProfile', {
          phone,
          inviteToken,
        });
      } else {
        Alert.alert('驗證失敗', data.message || '驗證碼錯誤，請重試');
        setVerificationCode('');
      }
    } catch (error) {
      console.error('驗證錯誤:', error);
      Alert.alert('錯誤', '網絡錯誤，請重試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setCanResend(false);
    setTimeLeft(60);

    try {
      const response = await fetch('http://localhost:8080/api/auth/resend-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          inviteToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('成功', '驗證碼已重新發送');
      } else {
        Alert.alert('錯誤', data.message || '重新發送失敗');
        setCanResend(true);
        setTimeLeft(0);
      }
    } catch (error) {
      console.error('重新發送錯誤:', error);
      Alert.alert('錯誤', '網絡錯誤，請重試');
      setCanResend(true);
      setTimeLeft(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (text: string) => {
    // 只允許數字
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 6) {
      setVerificationCode(numericText);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>簡訊驗證</Text>
        <Text style={styles.subtitle}>
          我們已發送驗證碼到
        </Text>
        <Text style={styles.phoneNumber}>{phone}</Text>
        <Text style={styles.instruction}>
          請輸入6位數驗證碼
        </Text>
      </View>

      <View style={styles.codeInputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.codeInput}
          value={verificationCode}
          onChangeText={handleCodeChange}
          placeholder="請輸入驗證碼"
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
          keyboardType="numeric"
          maxLength={6}
          textAlign="center"
          returnKeyType="done"
          onSubmitEditing={handleVerifyCode}
        />
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={isLoading || verificationCode.length !== 6}
      >
        <Text style={styles.verifyButtonText}>
          {isLoading ? '驗證中...' : '驗證'}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {timeLeft > 0 ? (
          <Text style={styles.timerText}>
            {formatTime(timeLeft)} 後可重新發送
          </Text>
        ) : (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={isLoading}
          >
            <Text style={styles.resendButtonText}>
              重新發送驗證碼
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          沒有收到簡訊？請檢查您的手機號碼是否正確
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#333',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#666',
      marginBottom: 8,
    },
    phoneNumber: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#4CAF50' : '#2196F3',
      marginBottom: 16,
    },
    instruction: {
      fontSize: 14,
      color: isDarkMode ? '#999' : '#666',
    },
    codeInputContainer: {
      marginBottom: 32,
    },
    codeInput: {
      borderWidth: 2,
      borderColor: isDarkMode ? '#333' : '#ddd',
      borderRadius: 12,
      paddingVertical: 20,
      paddingHorizontal: 16,
      color: isDarkMode ? '#fff' : '#333',
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: 8,
      textAlign: 'center',
    },
    verifyButton: {
      backgroundColor: '#2196F3',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
    verifyButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    resendContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    timerText: {
      fontSize: 14,
      color: isDarkMode ? '#999' : '#666',
    },
    resendButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    resendButtonText: {
      color: isDarkMode ? '#4CAF50' : '#2196F3',
      fontSize: 16,
      fontWeight: '600',
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: isDarkMode ? '#777' : '#888',
      textAlign: 'center',
      lineHeight: 18,
    },
  });

export default SmsVerification;
