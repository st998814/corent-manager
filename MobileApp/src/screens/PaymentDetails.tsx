
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import ReturnButton from "../components/ReturnButton";
import { RootStackParamList, PaymentItem } from "../navigation/BottomTabs";

type PaymentDetailsRouteProp = RouteProp<RootStackParamList, 'PaymentDetails'>;

export default function PaymentDetailsScreen(){
    const navigation = useNavigation();
    const route = useRoute<PaymentDetailsRouteProp>();
    const { paymentData } = route.params;

    // 直接使用從 Payment.tsx 傳來的 paymentData
    const currentPayment = paymentData;

    return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.title}>{currentPayment.title} - 付款詳情</Text>
            </View>

            <View style={styles.detailCard}>
                <View style={styles.content}>
                    <Text style={styles.label}>項目名稱:</Text>
                    <Text style={styles.value}>{currentPayment.title}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>金額:</Text>
                    <Text style={[styles.value, styles.amount]}>${currentPayment.amount}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>到期日:</Text>
                    <Text style={styles.value}>{currentPayment.dueDate || "無指定日期"}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>狀態:</Text>
                    <Text style={[
                        styles.value, 
                        styles.status,
                        currentPayment.status === "已付款" ? styles.paidStatus : styles.unpaidStatus
                    ]}>
                        {currentPayment.status}
                    </Text>
                </View>

                {currentPayment.description && (
                    <View style={styles.content}>
                        <Text style={styles.label}>描述:</Text>
                        <Text style={styles.value}>{currentPayment.description}</Text>
                    </View>
                )}
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
    paidStatus: {
        backgroundColor: "#E8F5E8",
        color: "#4CAF50",
    },
    unpaidStatus: {
        backgroundColor: "#FFF3E0",
        color: "#FF9800",
    },
});





