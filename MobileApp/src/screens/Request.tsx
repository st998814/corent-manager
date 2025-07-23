import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface RequestItem {
  id: string;
  type: string;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function RequestScreen() {
  const navigation = useNavigation();
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: "1",
      type: "Payment",
      description: "請求分攤本月水電費（每人 $30）",
      status: "Pending",
    },
    {
      id: "2",
      type: "Cleaning",
      description: "請求幫忙 7/28 負責廚房清潔",
      status: "Approved",
    },
    {
      id: "3",
      type: "Repair",
      description: "請求協助報修浴室燈泡",
      status: "Pending",
    },
  ]);

  const handleAddRequest = () => {
    // 之後可跳轉至新請求表單
    navigation.navigate("AddRequest" as never);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requests</Text>
      </View>

      {/* Request Cards */}
      {requests.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>{item.type}</Text>
            <Text
              style={[
                styles.cardStatus,
                item.status === "Approved"
                  ? { color: "#4CAF50" }
                  : item.status === "Rejected"
                  ? { color: "#F44336" }
                  : { color: "#FF9800" },
              ]}
            >
              {item.status}
            </Text>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      ))}

      {/* Add Request Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddRequest}>
        <Text style={styles.addButtonText}>＋ Add Request</Text>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1, // Android
    shadowColor: "#000", // iOS
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardType: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
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
