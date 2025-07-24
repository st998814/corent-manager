import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useUserStore } from '../store/useUserStore';
import { useNavigation } from '@react-navigation/native';


const EditProfileScreen = () => {const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { userId, username: initialUsername, token } = useUserStore(state => state);
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150'); // that's the default avatar URL
  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(isDarkMode);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      useNavigation().goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Profile' as never)
    console.log('Go back to Profile');
  };

  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          <Text style={styles.saveButton}>{isLoading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Avatar URL</Text>
          <TextInput
            style={styles.input}
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            placeholder="Paste image URL"
            autoCapitalize="none"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
        </View>
      </View>
      <View>

        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>



      </View>
    </ScrollView>
  );
};

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDarkMode ? '#fff' : '#000',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
  },
  formContainer: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: isDarkMode ? '#888' : '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#f0f0f0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
  },
});

export default EditProfileScreen;
