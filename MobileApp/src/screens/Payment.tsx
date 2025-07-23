import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface PaymentItem {
  id: string;
  title: string;
  amount: number;
  dueDate?: string;
}

export default function PaymentScreen() {
  const navigation = useNavigation();
  const [payments, setPayments] = useState<PaymentItem[]>([
    { id: "1", title: "房租", amount: 800, dueDate: "2025-08-01" },
    { id: "2", title: "水電費", amount: 120, dueDate: "2025-08-05" },
  ]);

  const handleAddPayment = () => {
    // 假設之後會跳轉到添加頁面 (或彈出表單)
    navigation.navigate("AddPayment" as never);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      {/* Payment Cards */}
      {payments.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAmount}>${item.amount}</Text>
          </View>
          {item.dueDate && (
            <Text style={styles.cardDueDate}>Due: {item.dueDate}</Text>
          )}
        </View>
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
