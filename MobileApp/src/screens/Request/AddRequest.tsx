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
import  { useState } from 'react';
import {  createFormScreen} from '../../stylesheet/formStyle';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
// componenets

import ReturnButton from '../../components/ReturnButton';
import DropDownMenu,{ type DropdownItem} from '../../components/DropDownMenu';





const AddRequestScreen = () => {
    const [requestType, setRequestType] = useState<string | undefined>(undefined);
    const [groupName,setGroupName]=useState('');

    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const styles=createFormScreen(isDarkMode)

    const typeOptions=[{label:"first",value:"1"},{label:"second",value:"2"},{label:"third",value:"3"}]

    const handleSelectType = (item: DropdownItem) => {
        setRequestType(item.value);
      

      };
      
  
    


  return (

      <ScrollView style={styles.container}>

        <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.title}>Post Request </Text>
        </View>



             <View style={styles.formContainer}>
               <Text style={styles.description}>Specify request you want to post</Text>
                 <View style={styles.inputGroup}>

                  <DropDownMenu items={typeOptions} selectedValue={requestType} onSelect={handleSelectType} placeholder="Request Type" style={{ marginBottom: 16 }} />





                 </View>






               

               




                 


            </View>









      </ScrollView>
    


      



    
    


  )
};

export default AddRequestScreen;

