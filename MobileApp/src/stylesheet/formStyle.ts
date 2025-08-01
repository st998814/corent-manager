
import { StyleSheet } from 'react-native';

export const createFormScreen = (isDarkMode: boolean) =>
  StyleSheet.create({
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
      shadowOffset: { width: 0, height: 2 },
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
    inputGroup: { marginBottom: 20 },
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
    submitButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    submitButtonText: {
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