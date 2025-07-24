

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import ReturnButton from "../components/ReturnButton";
import { RootStackParamList, RequestItem } from "../navigation/BottomTabs";

type RequestDetailsRouteProp = RouteProp<RootStackParamList, 'RequestDetails'>;

export default function RequestDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RequestDetailsRouteProp>();
  const { requestData } = route.params;
  const currentRequest = requestData;
  return(
          <ScrollView style={styles.container}>
              <View style={styles.header}>
                  <ReturnButton />
                  <Text style={styles.title}>{currentRequest.type} - 請求詳情</Text>
              </View>
  
              <View style={styles.detailCard}>
                  <View style={styles.content}>
                      <Text style={styles.label}>類型:</Text>
                      <Text style={styles.value}>{currentRequest.type}</Text>
                  </View>
  
                  <View style={styles.content}>
                      <Text style={styles.label}>描述:</Text>
                      <Text style={styles.value}>{currentRequest.description}</Text>
                  </View>
  
                  <View style={styles.content}>
                      <Text style={styles.label}>狀態:</Text>
                      <Text style={[
                          styles.value, 
                          styles.status,
                          currentRequest.status === "Approved" ? styles.approvedStatus : 
                          currentRequest.status === "Rejected" ? styles.rejectedStatus : 
                          styles.pendingStatus
                      ]}>
                          {currentRequest.status || "無指定狀態"}
                      </Text>
                  </View>
              </View>
          </ScrollView>
      )
  

}

















const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 16,
        flex: 1,
    },
    detailCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: "#333",
    },
    amount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    status: {
        fontWeight: "600",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        textAlign: 'center',
        overflow: 'hidden',
    },
    approvedStatus: {
        backgroundColor: "#E8F5E8",
        color: "#4CAF50",
    },
    rejectedStatus: {
        backgroundColor: "#FFEBEE",
        color: "#F44336",
    },
    pendingStatus: {
        backgroundColor: "#FFF3E0",
        color: "#FF9800",
    },
});




