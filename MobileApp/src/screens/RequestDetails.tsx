

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import ReturnButton from "../components/ReturnButton";
import { RootStackParamList, RequestItem } from "../navigation/BottomTabs";

type RequestDetailsRouteProp = RouteProp<RootStackParamList, 'RequestDetails'>;

// interface RequestDetailsScreenProps {
//     status: string; // "Pending" | "Approved" | "Rejected"



// }

export default function RequestDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RequestDetailsRouteProp>();
  const { requestData, onUpdateStatus } = route.params;
  const [currentRequest, setCurrentRequest] = useState(requestData);

  const handleApprove = () => {
    Alert.alert(
      "確認接受",
      "你確定要接受這個請求嗎？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "接受",
          style: "default",
          onPress: () => {
            const updatedRequest = { ...currentRequest, status: "Approved" };
            setCurrentRequest(updatedRequest);
            onUpdateStatus(currentRequest.id, "Approved");
            Alert.alert("成功", "請求已被接受！");
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      "確認拒絕",
      "你確定要拒絕這個請求嗎？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "拒絕",
          style: "destructive",
          onPress: () => {
            const updatedRequest = { ...currentRequest, status: "Rejected" };
            setCurrentRequest(updatedRequest);
            onUpdateStatus(currentRequest.id, "Rejected");
            Alert.alert("已拒絕", "請求已被拒絕。");
            navigation.goBack();
          }
        }
      ]
    );
  };
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
                      <Text style={styles.label}>Status</Text>
                      <Text style={[
                          styles.value, 
                          styles.status,
                          // if (currentRequest.status === "Approved") {
                          //   styles.approvedStatus;
                          currentRequest.status === "Approved" ? styles.approvedStatus : 
                          //elif (currentRequest.status === "Rejected") {    styles.rejectedStatus; }  
                          currentRequest.status === "Rejected" ? styles.rejectedStatus : 
                          //else 
                          styles.pendingStatus
                      ]}>
                          {currentRequest.status || "無指定狀態"}
                      </Text>
                  </View>

                  <View style={styles.content}>
                    <Text style={styles.label}>Requester</Text>
                    <Text style={styles.value}>{currentRequest.host || "無指定請求人"}</Text>
                  </View>

                  {/* 當狀態為 Pending 時顯示操作按鈕 */}
                  {currentRequest.status === "Pending" && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.button, styles.approveButton]}
                        onPress={handleApprove}
                      >
                        <Text style={styles.buttonText}>✓ 接受請求</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.button, styles.rejectButton]}
                        onPress={handleReject}
                      >
                        <Text style={styles.buttonText}>✕ 拒絕請求</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* 當狀態不是 Pending 時顯示狀態資訊 */}
                  {currentRequest.status !== "Pending" && (
                    <View style={styles.statusInfo}>
                      <Text style={styles.statusText}>
                        此請求已經被 {currentRequest.status === "Approved" ? "接受" : "拒絕"}
                      </Text>
                    </View>
                  )}
              </View>
          </ScrollView>
      );
  

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
    
    // 操作按鈕樣式
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 6,
        alignItems: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    approveButton: {
        backgroundColor: "#4CAF50",
    },
    rejectButton: {
        backgroundColor: "#F44336",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    
    // 狀態資訊樣式
    statusInfo: {
        marginTop: 20,
        padding: 16,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 16,
        color: "#666",
        fontWeight: "500",
    },
});




