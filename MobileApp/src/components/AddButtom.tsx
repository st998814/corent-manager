import React  from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
  
} from "react-native";

import { useTheme } from "../context/ThemeContext";


// props type declare

type AddButtonProps = {
    onPress: (event: any) => void;
};

function AddButtom({ onPress }: AddButtonProps) {


    const {isDarkMode}=useTheme();
    const styles=createStyles(isDarkMode);












    return(
        <View style = {styles.btnContainer}>
            <TouchableOpacity 
                style = {styles.btn}
                onPress={onPress}
                >
                
                    <Image src={"MobileApp/src/assets/add_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"} style={styles.btn}/>
             
            </TouchableOpacity>
        </View>


        





    )







}





export default AddButtom;




const createStyles = (isDarkMode: boolean) => StyleSheet.create({

    btnContainer:{


        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 30,

    },
    btn:{
        justifyContent: 'center',
        padding: 10,
        height: 30,
        width: '100%',
        flexDirection: 'row',
        





    }
















})