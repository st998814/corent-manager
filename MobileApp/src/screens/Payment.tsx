import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ListCard from "../components/ListCard";
import PaymentDetailsScreen from "./PaymentDetails";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, PaymentItem } from "../navigation/BottomTabs"; 
import { useTheme } from "../context/ThemeContext"; 

type PaymentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PaymentDetails"
>;

export default function PaymentScreen() {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const [payments, setPayments] = useState<PaymentItem[]>([
    { 
      id: "1", 
      title: "房租", 
      amount: 800, 
      dueDate: "2025-08-01", 
      status: "未付款",
      description: "每月房租費用"
    },
    { 
      id: "2", 
      title: "水電費", 
      amount: 120, 
      dueDate: "2025-08-05", 
      status: "已付款",
      description: "7月份水電費用"
    },
  ]);

  const handleAddPayment = () => {
    // 假設之後會跳轉到添加頁面 (或彈出表單)
    navigation.navigate("AddPayment" as never);
  };

  const handlePaymentDetails = (payment: PaymentItem) => {
    navigation.navigate("PaymentDetails", { paymentData: payment });
  };

  const styles = createStyles(isDarkMode);

  return (
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      {/* Payment Cards */}
    
      {payments.map((item) => (
        <ListCard
          key={item.id}
          paymentData={{
            id: item.id,
            title: item.title,
            description: `Due: ${item.dueDate || "N/A"}`,
            amount: item.amount,

          }}
          onPress={() => handlePaymentDetails(item)}
        />
      ))}

      {/* Add Payment Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
        <Text style={styles.addButtonText}>＋ Add Payment</Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: isDarkMode ? "#fff" : "#000",
  },
  cardAmount: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  cardDueDate: {
    fontSize: 13,
    color: isDarkMode ? "#999" : "#888",
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
