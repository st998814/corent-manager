
import { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text ,Button} from 'react-native';
import { StatusBarStyle } from 'react-native';
import { TextInput } from 'react-native';

function App() {
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>("dark-content");
  // Toggle between dark and light status bar styles
  const toggleStatusBarStyle = () => {
    setStatusBarStyle(statusBarStyle === "dark-content" ? "light-content" : "dark-content");
  };

 
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
      <StatusBar barStyle={statusBarStyle} />
      
      
      <Button title="Change the theme of status bar" onPress={(toggleStatusBarStyle)} />
      <Text style={styles.text}>current style is {statusBarStyle}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple', 
  },

  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
