import React, { use, useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/BottomTabs";
import { StackNavigationProp } from "@react-navigation/stack";
import ListCard from "../../components/ListCard";
import { useTheme } from "../../context/ThemeContext";



interface RequestItem {
  id: string;
  type: string;
  host: string;
  description: string;
  status: string;
}




type RequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RequestDetails"
>;
export default function RequestScreen() {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<RequestScreenNavigationProp>();
  const styles = createStyles(isDarkMode);




  const listOfRequests: RequestItem[] = [

    {
      id: "1",
      type: "Payment",
      host:"steven", // the guy who posted the request
      description: "請求分攤本月水電費（每人 $30）",
      status: "Pending",
    },
    {
      id: "2",
      type: "Cleaning",
      host:"bob",
      description: "請求幫忙 7/28 負責廚房清潔",
      status: "Pending",
    },
    {
      id: "3",
      type: "Repair",
      host:"bob",
      description: "請求協助報修浴室燈泡",
      status: "Approved",
    },
    {
      id: "4",
      type: "Payment",
      host:"alice",
      description: "請求分攤本月網路費（每人 $50）",
      status: "Pending",
    },


  ]

  const [requestList, setRequestList] = useState<RequestItem[]>(listOfRequests);
  const [requests, setRequests] = useState<RequestItem[]>();

  
  //to render a list of requests , and will re-render when requests state changes
  useEffect(() => {
    setRequests(requestList);
   

  }, [requestList]);

  const handleAddRequest = () => {
    navigation.navigate("AddRequest" as never);
  };

  // 
  const updateRequestStatus = (requestId: string, newStatus: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus }
          : req
      )
    );
  };

  const renderNewRequest = (newRequest: RequestItem) => {
    setRequestList(prev => [...prev, newRequest]);
    setRequests(prev => [...prev, newRequest]);
  };

  const handleRequestDetails = (request: RequestItem) => {
    navigation.navigate("RequestDetails", { 
      requestData: request,
      status: request.status,
      onUpdateStatus: updateRequestStatus, // 傳遞更新函數
    });
  };






  return (
    
    <ScrollView style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requests</Text>
      </View>

      {/* Request Cards */}
      {requestList.map((item) => (
        <ListCard
          key={item.id}
          requestData={{
            id: item.id,
            host: item.host,
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
  // card: {
  //   backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
  //   borderRadius: 8,
  //   padding: 16,
  //   marginBottom: 12,
  //   elevation: 1,
  //   shadowColor: isDarkMode ? "#fff" : "#000",
  //   shadowOpacity: isDarkMode ? 0.1 : 0.05,
  //   shadowRadius: 3,
  //   borderWidth: isDarkMode ? 1 : 0,
  //   borderColor: isDarkMode ? "#333" : "transparent",
  // },
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
