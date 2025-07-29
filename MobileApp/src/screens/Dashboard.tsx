import React, { useState ,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
  
} from "react-native";
import { useUserStore } from "../store/useUserStore";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

import axios from "axios";

// components
import AddButtom from "../components/AddButton";



interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  isCurrentUser: boolean;
}

interface GroupData {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  userRole: string;
  members: Member[];
}

export default function GroupsScreen() {


  const { token } = useUserStore(state => state);
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const navigation = useNavigation();

  // hooks
  const [members, setMembers] = useState<Member[]>([]);
  const [groupsData, setGroupsData] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(false);



 useEffect(() => {

  const fetchGroupInfo = async () => {
    setIsLoading(true);
    try {

          const response = await axios.post( 
        'http://192.168.20.12:8080/api/groups/groupinfo',
        {},
         
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );


    if (response.data.success){
      setGroupsData(response.data.groups)

      const allMembers: Member[] = [];
      const memberIds = new Set();
      

  



      




      response.data.groups.forEach((group: GroupData) => {
      group.members.forEach((member: Member) => {
              if (!memberIds.has(member.id)) {
                memberIds.add(member.id);
                allMembers.push(member);
              }
            });
          });


      
      setMembers(allMembers);


      console.log('✅ 設置成員資料:', allMembers);
        } else {
          Alert.alert('錯誤', response.data.message || '獲取群組資訊失敗');
        };

    } catch (error) {
      console.error('獲取群組資訊失敗:', error);
      Alert.alert('錯誤', '獲取群組資訊失敗');
    }finally{


      setIsLoading(false);
    }
  };
  fetchGroupInfo();
}, [token]);



  const toAddMember=()=>{

    navigation.navigate('AddMember'as never)



  }
  



  

   


  return (
    
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>

        <View style={styles.titleContainer}>
          {members.length>0 ?( <View>
            <Text style={styles.headerTitle}>{groupsData[0].name}</Text>
            <Text style={styles.headerSubtitle}>
              Welcome!
            </Text>
          </View>):(<View>
            <Text style={styles.headerTitle}>Groups</Text>
            <Text style={styles.headerSubtitle}>
              管理你的小組與成員邀請
            </Text>
          </View>


          )}

          <AddButtom onPress={toAddMember}/>


        </View>
      </View>

      {/* 成員卡片 */}

        {members.length > 0 ? (
        members.map((member) => (
          <View key={member.id} style={styles.card}>
            <Text style={styles.memberName}>
              {member.name}
              {member.isCurrentUser && (
                <Text style={styles.currentUserTag}> (我)</Text>
              )}
            </Text>
            <Text style={styles.memberEmail}>{member.email}</Text>
            <Text style={styles.memberRole}>角色: {member.role}</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>還沒有加入任何群組</Text>
          <Text style={styles.emptySubText}>創建或加入一個群組開始吧！</Text>
        </View>
      )}

 

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
    paddingTop: 80,
  },
  header: {
    marginTop: 10, 
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

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
   statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
    loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: isDarkMode ? "#fff" : "#000",
  },
    emptyContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
    currentUserTag: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "400",
  },
    memberRole: {
    fontSize: 12,
    color: isDarkMode ? "#999" : "#777",
    fontWeight: "500",
  },
    emptyText: {
    fontSize: 16,
    color: isDarkMode ? "#999" : "#666",
    fontWeight: "500",
  },
    emptySubText: {
    fontSize: 14,
    color: isDarkMode ? "#777" : "#888",
    marginTop: 8,
  },
});
