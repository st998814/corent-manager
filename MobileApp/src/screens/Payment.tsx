import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ListCard from "../components/ListCard";
import PaymentDetailsScreen from "./PaymentDetails";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, PaymentItem } from "../navigation/BottomTabs"; 

type PaymentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PaymentDetails"
>;

export default function PaymentScreen() {

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 60, // 添加 top padding 來補償移除的 header
  },
  header: {
    marginTop: 10, // 減少 marginTop，因為已經有 paddingTop
    marginBottom: 20,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardAmount: {
    fontSize: 16,
    color: "#4CAF50", // 綠色表示支付金額
    fontWeight: "600",
  },
  cardDueDate: {
    fontSize: 13,
    color: "#888",
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
