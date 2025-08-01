import React from "react";
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
import { RouteProp } from '@react-navigation/native';
import  { useState } from 'react';
import {  createFormScreen} from '../../stylesheet/formStyle';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../navigation/BottomTabs';
// componenets

import ReturnButton from '../../components/ReturnButton';
import DropDownMenu,{ type DropdownItem} from '../../components/DropDownMenu';



interface RequestItem {
  id: string;
  type: string;
  host: string;
  description: string;
  status: string;
}

type AddRequestRouteProp = RouteProp<RootStackParamList, 'AddRequest'>;

interface AddRequestScreenProps {
  route: AddRequestRouteProp;
  navigation: any;
}

const AddRequestScreen = ({ route, navigation }: AddRequestScreenProps) => {
  console.log('🎯 AddRequest 組件接收到的參數:', route.params);
  
  const { onRequestAdded, currentUser, groupId } = route.params || {};
  
  console.log('📥 解構出的參數:');
  console.log('  - onRequestAdded:', onRequestAdded);
  console.log('  - currentUser:', currentUser);
  console.log('  - groupId:', groupId);

    const [title, setTitle] = useState('');
    const [requestType, setRequestType] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState('');
    

    
    const { isDarkMode } = useTheme();
    const styles=createFormScreen(isDarkMode)

    const typeOptions=[{label:"Payment",value:"Payment"},{label:"Support",value:"Support"},{label:"Event",value:"Event"}]


    const handleSelectType = (item: DropdownItem) => {
        setRequestType(item.value);
        console.log('🔽 選擇的請求類型:', item);

      };
      const handleSubmit = async () => {
        console.log('🚀 開始提交請求');
        console.log('📝 表單數據:');
        console.log('  - title:', title);
        console.log('  - requestType:', requestType);
        console.log('  - description:', description);
        console.log('  - currentUser:', currentUser);
        console.log('  - onRequestAdded 函數:', onRequestAdded);
        
        if (!title || !requestType || !description) {
          console.log('❌ 表單驗證失敗');
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }

        if (!onRequestAdded) {
          console.log('❌ onRequestAdded 回調函數未找到');
          Alert.alert('Error', 'Failed to add request - callback function missing');
          return;
        }

         const newRequest: RequestItem = {
                        id: Math.random().toString(36).substring(7),
                        type: requestType,
                        host: currentUser || 'Anonymous',
                        description: title, // 使用 title 作為 description
                        status: 'Pending', // 改為首字母大寫，與其他請求保持一致
                      };
                      
        console.log('📋 新建的請求:', newRequest);
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000)); 
          
          console.log('✅ 模擬 API 調用成功，調用回調函數');
          onRequestAdded(newRequest);
          
          console.log('🔙 導航返回上一頁');
          navigation.goBack();
        } catch (error) {
          console.log('❌ 提交失敗:', error);
          Alert.alert('Error', 'Failed to add request');
        }
      };     
  
    


  return (

      <ScrollView style={styles.container}>

        <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.title}>Post Request </Text>
        </View>
           <View>



            <View style={styles.inputGroup}>

            </View>

             <Text style={styles.description}>Specify request you want to post</Text>
           </View>



             <View style={styles.formContainer}>
                <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
              />
              
                 <View style={styles.inputGroup}>

                  <DropDownMenu items={typeOptions} selectedValue={requestType} onSelect={handleSelectType} placeholder="Request Type" style={{ marginBottom: 16 }} />

                 </View>
                 <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                  />
                 </View>

                 <View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                  </TouchableOpacity>


                 </View>

                 
              
            </View>

      </ScrollView>
    


      



    
    


  )
};

export default AddRequestScreen;

