import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from  "../context/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";

import { useState } from "react";


// types


// components

import PrimaryButton from "../components/PrimaryButton";
import AddButtom from "../components/AddButtom";

import ReturnButton from "../components/ReturnButton";





// interface types{

//   label:string;
//   value: any;
//   icon?: string;








// };

const AddRequestScreen=()=>{

 
        const [requestType,setRequestType]=useState();
        const [requestDetails,setRequestDetails]=useState();
        

        const [loading, setLoading] = useState(false);


        const {isDarkMode}=useTheme();

        console.log(isDarkMode);
        const styles=createStyles(isDarkMode);

        const navigation= useNavigation();

        const handlePost=()=>{




        };

        //define types of request

        const types=[
          {label:"Event",value:"selectEvent"},
          {label:"Payment",value:"selectPayment"},
          {label:"Cleaning",value:"selectCleaning"}
        ]




        return (
            <ScrollView style={styles.container}>

                 <View style={styles.header}>
                        <ReturnButton />
                        <Text style={styles.title}>Post Your Request !</Text>
                      </View>
                
                      <View style={styles.formContainer}>
                        <Text style={styles.description}>
                            Selecting Type of Request and Brifely Describe it !
                        </Text>
                        </View>
                        
            

            </ScrollView>
        );









};







export default AddRequestScreen;






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
    lineHeight: 24,
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







})