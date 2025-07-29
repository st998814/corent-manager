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

// Make sure you have a PNG version of your icon in the assets folder
function AddButtom({ onPress }: AddButtonProps) {


    const {isDarkMode}=useTheme();
    const styles=createStyles(isDarkMode);












    return(
        <View style = {styles.btnContainer}>
            <TouchableOpacity 
                style = {styles.btn}
                onPress={onPress}
                >
                    <Image 
                    source={require("../assets/add_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png")} 
                    style={styles.addIcon}
                />
                

                
                    
             
            </TouchableOpacity>
        </View>


        





    )







}





export default AddButtom;




const createStyles = (isDarkMode: boolean) => StyleSheet.create({
    btnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 30,
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        height: 56,
        width: 56,
        
        borderRadius: 28,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        alignSelf: 'center',
    },
    addIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    }
});