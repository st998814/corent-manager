import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList,RequestItem } from "../navigation/BottomTabs";
import { StackNavigationProp } from "@react-navigation/stack";
import ListCard from "../components/ListCard";
import ReturnButton from "../components/ReturnButton";
import { useTheme } from "../context/ThemeContext";
// interface RequestItem {
//   id: string;
//   type: string;
//   description: string;
//   status: "Pending" | "Approved" | "Rejected";
// }
type RequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RequestDetails"
>;
export default function RequestScreen() {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<RequestScreenNavigationProp>();
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

  const handleRequestDetails = (request: RequestItem) => {
    navigation.navigate("RequestDetails", { requestData: request });
  };

  const styles = createStyles(isDarkMode);

  return (
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requests</Text>
      </View>

      {/* Request Cards */}
            {requests.map((item) => (
              <ListCard
                key={item.id}
                requestData={{
                  id: item.id,
                  type: item.type,
                  description: item.description,
                  status: item.status,
                }}
                onPress={() => handleRequestDetails(item)}
              />
            ))}


      {/* Add Request Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddRequest}>
        <Text style={styles.addButtonText}>＋ Add Request</Text>
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
  headerTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: isDarkMode ? "#fff" : "#000",
  },
  card: {
    backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: isDarkMode ? "#fff" : "#000",
    shadowOpacity: isDarkMode ? 0.1 : 0.05,
    shadowRadius: 3,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: isDarkMode ? "#333" : "transparent",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardType: {
    fontSize: 15,
    fontWeight: "600",
    color: isDarkMode ? "#fff" : "#000",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    color: isDarkMode ? "#ccc" : "#555",
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
