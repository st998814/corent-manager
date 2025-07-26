import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReturnButton from '../components/ReturnButton';
import { useTheme } from '../context/ThemeContext';
import { useUserStore } from '../store/useUserStore';
import axios from 'axios';

export default function JoinGroupScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { token } = useUserStore(state => state);
  
  const [groupCode, setGroupCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);

  const styles = createStyles(isDarkMode);

  const handleVerifyCode = async () => {
    if (!groupCode.trim()) {
      Alert.alert('錯誤', '請輸入群組驗證碼');
      return;
    }

    setIsLoading(true);
    try {
      // 驗證群組代碼並獲取群組資訊
      const response = await axios.get(`http://192.168.20.12:8080/api/groups/verify/${groupCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setGroupInfo(response.data.group);
    } catch (error) {
      console.error('驗證群組代碼失敗:', error);
      Alert.alert(
        '驗證失敗',
        error.response?.data?.message || '無效的群組驗證碼或群組不存在'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupInfo) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`http://192.168.20.12:8080/api/groups/${groupInfo.id}/join`, {
        code: groupCode,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert(
        '成功',
        '已成功加入群組！',
        [
          {
            text: '確定',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('加入群組失敗:', error);
      Alert.alert(
        '加入失敗',
        error.response?.data?.message || '加入群組時發生錯誤'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGroupCode('');
    setGroupInfo(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ReturnButton />
        <Text style={styles.title}>加入群組</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.description}>
          請輸入群組管理員提供的驗證碼來加入群組
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>群組驗證碼</Text>
          <TextInput
            style={styles.input}
            value={groupCode}
            onChangeText={setGroupCode}
            placeholder="輸入 6 位數驗證碼"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            maxLength={6}
            keyboardType="default"
            autoCapitalize="characters"
            editable={!groupInfo}
          />
        </View>

        {!groupInfo ? (
          <TouchableOpacity
            style={[styles.button, styles.verifyButton]}
            onPress={handleVerifyCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>驗證代碼</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.groupInfoContainer}>
            <Text style={styles.groupInfoTitle}>群組資訊</Text>
            <View style={styles.groupInfoCard}>
              <Text style={styles.groupName}>{groupInfo.name}</Text>
              <Text style={styles.groupDescription}>{groupInfo.description}</Text>
              <Text style={styles.memberCount}>
                成員數: {groupInfo.memberCount || 0}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={resetForm}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>重新輸入</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.joinButton]}
                onPress={handleJoinGroup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>加入群組</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: isDarkMode ? '#fff' : '#000',
  },
  formContainer: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  description: {
    fontSize: 14,
    color: isDarkMode ? '#ccc' : '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: isDarkMode ? '#888' : '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#f0f0f0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    textAlign: 'center',
    letterSpacing: 2,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  verifyButton: {
    backgroundColor: '#2196F3',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: isDarkMode ? '#666' : '#ccc',
    flex: 1,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: isDarkMode ? '#ccc' : '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  groupInfoContainer: {
    marginTop: 8,
  },
  groupInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#fff' : '#000',
    marginBottom: 12,
  },
  groupInfoCard: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#fff' : '#000',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: isDarkMode ? '#ccc' : '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  memberCount: {
    fontSize: 12,
    color: isDarkMode ? '#888' : '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
