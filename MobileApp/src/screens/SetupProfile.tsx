import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeStore } from '../store/useThemeStore';
import { useUserStore } from '../store/useUserStore';

type RootStackParamList = {
  SetupProfile: {
    phone: string;
    inviteToken?: string;
  };
  Dashboard: undefined;
};

type SetupProfileRouteProp = RouteProp<RootStackParamList, 'SetupProfile'>;
type SetupProfileNavigationProp = StackNavigationProp<RootStackParamList, 'SetupProfile'>;

const SetupProfile: React.FC = () => {
  const route = useRoute<SetupProfileRouteProp>();
  const navigation = useNavigation<SetupProfileNavigationProp>();
  const { phone, inviteToken } = route.params;
  
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';
  const { setUser } = useUserStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(isDarkMode);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('錯誤', '請輸入您的姓名');
      return;
    }

    if (!email.trim()) {
      Alert.alert('錯誤', '請輸入您的email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('錯誤', '請輸入有效的email格式');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/setup-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          name: name.trim(),
          email: email.trim(),
          inviteToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 設置用戶信息到store
        setUser(data.user.id, data.user.name, data.token);

        Alert.alert(
          '成功',
          '個人資料設置完成！',
          [
            {
              text: '確定',
              onPress: () => navigation.navigate('Dashboard'),
            },
          ]
        );
      } else {
        Alert.alert('錯誤', data.message || '設置失敗，請重試');
      }
    } catch (error) {
      console.error('設置個人資料錯誤:', error);
      Alert.alert('錯誤', '網絡錯誤，請重試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>設置個人資料</Text>
          <Text style={styles.subtitle}>
            請完善您的個人信息以完成註冊
          </Text>
          <Text style={styles.phoneInfo}>
            手機號碼: {phone}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>姓名 *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="請輸入您的姓名"
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="請輸入您的email"
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? '設置中...' : '完成設置'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            設置完成後，您就可以開始使用所有功能了
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#333',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#666',
      textAlign: 'center',
      marginBottom: 16,
    },
    phoneInfo: {
      fontSize: 14,
      color: isDarkMode ? '#4CAF50' : '#2196F3',
      backgroundColor: isDarkMode ? '#1a4d1a' : '#e3f2fd',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    form: {
      marginBottom: 32,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#333',
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#ddd',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === 'ios' ? 16 : 12,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#333',
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    },
    submitButton: {
      backgroundColor: '#2196F3',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: isDarkMode ? '#999' : '#666',
      textAlign: 'center',
      lineHeight: 20,
    },
  });

export default SetupProfile;
