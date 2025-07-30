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





const AddRequestScreen = () => {

    const [groupName,setGroupName]=useState('');

    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const styles=createFormScreen(isDarkMode)
    


  return (

      <ScrollView style={styles.container}>

        <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.title}>Post Request </Text>
        </View>



             <View style={styles.formContainer}>
               <Text style={styles.description}>Specify request you want to post</Text>

               <></>




                 


            </View>









      </ScrollView>
    


      



    
    


  )
};

export default AddRequestScreen;

