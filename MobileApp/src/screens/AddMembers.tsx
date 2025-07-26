import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ReturnButton from "../components/ReturnButton";
import { useTheme } from "../context/ThemeContext";
import { useUserStore } from "../store/useUserStore";

type RootStackParamList = {
  SmsVerification: {
    phone: string;
    inviteToken?: string;
    isJoiningGroup?: boolean;
  };
};

export default function AddMemberScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useTheme();
  const { token } = useUserStore(state => state);

  const styles = createStyles(isDarkMode);

  const handleSendInvite = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("錯誤", "請完整輸入姓名與電話號碼");
      return;
    }

    // 簡單的電話號碼格式驗證
    const phoneRegex = /^[+]?[\d\s\-()]{8,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert("錯誤", "請輸入有效的電話號碼格式");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://192.168.20.12:8080/api/members/invite", {
        name: name.trim(),
        phone: phone.trim(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert(
        "邀請已發送", 
        `已向 ${name.trim()} (${phone.trim()}) 發送簡訊邀請\n\n成員收到簡訊後需要進行驗證才能加入群組`,
        [
          {
            text: "協助驗證",
            onPress: () => {
              // 導向SMS驗證頁面協助新成員
              navigation.navigate('SmsVerification', {
                phone: phone.trim(),
                inviteToken: res.data.inviteToken,
                isJoiningGroup: true,
              });
            }
          },
          {
            text: "完成",
            style: "cancel",
            onPress: () => {
              setName("");
              setPhone("");
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "發送失敗",
        error.response?.data?.message || "發送邀請時發生錯誤"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ReturnButton />
        <Text style={styles.title}>邀請成員</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.description}>
          輸入新成員的資訊來發送群組邀請簡訊
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>姓名 *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="輸入成員姓名"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>電話號碼 *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="輸入電話號碼"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            keyboardType="phone-pad"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendInvite}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>發送邀請</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>💡 提示</Text>
          <Text style={styles.infoText}>
            • 邀請將通過簡訊發送給新成員{'\n'}
            • 成員需要點擊簡訊中的鏈接來加入群組{'\n'}
            • 您可以在群組管理中查看邀請狀態
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
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#e0e0e0',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
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
    borderLeftColor: '#4CAF50',
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
