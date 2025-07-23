import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

interface Member {
  id: string;
  name: string;
  email: string;
  status: "Pending" | "Accepted" | "Rejected";
}

export default function GroupsScreen() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Steven Wang",
      email: "st998814@gmail.com",
      status: "Accepted",
    },
    {
      id: "2",
      name: "Emily Chen",
      email: "emily.chen@gmail.com",
      status: "Pending",
    },
  ]);

  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groups</Text>
        <Text style={styles.headerSubtitle}>
          管理你的小組與成員邀請
        </Text>
      </View>

      {/* 成員卡片 */}
      {members.map((member) => (
        <View key={member.id} style={styles.card}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberEmail}>{member.email}</Text>
          <Text
            style={[
              styles.memberStatus,
              member.status === "Accepted"
                ? { color: "#4CAF50" }
                : member.status === "Pending"
                ? { color: "#FF9800" }
                : { color: "#F44336" },
            ]}
          >
            {member.status}
          </Text>
        </View>
      ))}

      {/* Add Member Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMember' as never)}>
        <Text style={styles.addButtonText}>＋ Add Member</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
  },
  memberEmail: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  memberStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    alignItems: "center",
    marginVertical: 20,
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
