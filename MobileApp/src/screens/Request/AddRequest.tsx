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



interface AddRequestScreenProps {

  onRequestAdded: (newRequest: RequestItem) => void;
  
  
}

const AddRequestScreen = ({ route, navigation }: AddRequestScreenProps) => {
  const { onRequestAdded, currentUser, groupId } = route.params || {};

    const [title, setTitle] = useState('');
    const [requestType, setRequestType] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState('');
    

    
    const { isDarkMode } = useTheme();
    const styles=createFormScreen(isDarkMode)

    const typeOptions=[{label:"Payment",value:"1"},{label:"Support",value:"2"},{label:"Event",value:"3"}]


    const handleSelectType = (item: DropdownItem) => {
        setRequestType(item.value);

      

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
                 
                 
              
            </View>

      </ScrollView>
    


      



    
    


  )
};

export default AddRequestScreen;

