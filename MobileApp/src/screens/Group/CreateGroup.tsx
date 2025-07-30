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
import ReturnButton from '../../components/ReturnButton';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store/useUserStore';
import axios from 'axios';

export default function CreateGroupScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { token } = useUserStore(state => state);
  
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(isDarkMode);

  const handleCreateGroup = async () => {

    // if (!groupName.trim()) {
    //   Alert.alert('錯誤', '請輸入群組名稱');
    //   return;
    // }

    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.20.12:8080/api/groups/create', {
        name: groupName.trim(),
        description: groupDescription.trim(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    //   if (!token){

    //     console.log("No token")




    //   };


    
      

      const { group } = response.data;

      Alert.alert(
        '群組創建成功！',
        `群組名稱: ${group.name}\n Your Group ID: ${group.id}\n\n `,
        [
          {
            text: '確定',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('創建群組失敗:', error);
      Alert.alert(
        '創建失敗',
        error.response?.data?.message || '創建群組時發生錯誤'
      );
    } finally {
      setIsLoading(false);
    }
  };





  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ReturnButton />
        <Text style={styles.title}>創建群組</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.description}>
          創建一個新的共居群組來管理成員和共同事務
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>群組名稱 *</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="例如：陽明山共居小屋"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            maxLength={50}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>群組描述</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={groupDescription}
            onChangeText={setGroupDescription}
            placeholder="描述群組的目的或規則..."
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateGroup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>創建群組</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>💡 提示</Text>
          <Text style={styles.infoText}>
            • 創建成功後會生成一個 6 位數的驗證碼{'\n'}
            • 分享驗證碼給其他成員讓他們加入群組{'\n'}
            • 您將自動成為群組管理員
          </Text>
        </View>
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
    marginBottom: 20,
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
  },
  textArea: {
    minHeight: 100,
    maxHeight: 120,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#fff' : '#000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: isDarkMode ? '#ccc' : '#666',
    lineHeight: 18,
  },
});
