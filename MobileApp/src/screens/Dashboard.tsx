import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import AddButtom from "../components/AddButtom";

interface Member {
  id: string;
  name: string;
  email: string;
  
}

export default function GroupsScreen() {
  

  const navigation = useNavigation();

  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [members, setMembers] = useState<Member[]>([
    
    {
      id: "1",
      name: "Steven Wang",
      email: "st998814@gmail.com",
     
    },
    {
      id: "2",
      name: "Emily Chen",
      email: "emily.chen@gmail.com"
     
    },


  ]);


  const toAddMember=()=>{

    navigation.navigate('AddMember' as never);

  };



  return (
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groups</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.headerSubtitle}>
            管理你的小組與成員邀請
          </Text>
          <TouchableOpacity style={styles.headerAddButton} onPress={toAddMember}>
            <Text style={styles.headerAddText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 成員卡片 */}
      {members.map((member) => (
        <View key={member.id} style={styles.card}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberEmail}>{member.email}</Text>
        </View>
      ))}

      {/* Add Member Button */}
      
      {/* Join Group Button */}
      <TouchableOpacity style={styles.joinButton} onPress={() => navigation.navigate('JoinGroup' as never)}>
        <Text style={styles.joinButtonText}>🔗 Join Group</Text>
      </TouchableOpacity>

      {/* Create Group Button */}
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateGroup' as never)}>
        <Text style={styles.createButtonText}>➕ Create Group</Text>
      </TouchableOpacity>

      


    </ScrollView>

  );
}

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    marginTop: 10, 
    marginBottom: 20,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: isDarkMode ? "#fff" : "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: isDarkMode ? "#999" : "#666",
    flex: 1,
  },
  headerAddButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAddText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
    borderRadius: 8,
    padding: 18,
    marginBottom: 12,
    elevation: 1,
    shadowColor: isDarkMode ? "#fff" : "#000",
    shadowOpacity: isDarkMode ? 0.1 : 0.05,
    shadowRadius: 3,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: isDarkMode ? "#333" : "transparent",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: isDarkMode ? "#fff" : "#000",
  },
  memberEmail: {
    fontSize: 14,
    color: isDarkMode ? "#ccc" : "#555",
    marginVertical: 4,
  },
  memberStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  joinButton: {
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: "#2196F3",
    borderRadius: 6,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  createButton: {
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: "#FF9800",
    borderRadius: 6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
