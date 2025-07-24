import React from 'react';
import { TouchableOpacity, Text,StyleSheet ,View} from 'react-native';




type PaymentData = {
  id: string;
  title: string;
  description: string;
  amount: number;
};
type RequestData = {
  id: string;
  type: string;
  description: string;
  status: string;
};


// props for the ListCard component
type ListCardProps = {
  paymentData?: PaymentData;
  requestData?: RequestData;
  style?: object; // optional style prop for custom styling
  onPress: () => void;
  disabled?: boolean;
};


export default function ListCard({ paymentData, requestData, onPress, disabled = false }: ListCardProps) {

const isPaymentCard = !!paymentData;
  const data = paymentData || requestData;
  
  if (!data) {
    return null; // 如果沒有資料就不渲染
  }


  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={disabled}
      key={data.id}
    >
      {isPaymentCard && paymentData && (
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{paymentData.title}</Text>
          <Text style={styles.cardAmount}>${paymentData.amount}</Text>
        </View>
      )}
        {!isPaymentCard && requestData && (
            <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{requestData.type}</Text>
            <Text style={styles.cardStatus}>{requestData.status}</Text>
            </View>
        )}
      <Text style={styles.cardDescription}>{data.description}</Text>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

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

  cardDescription: {
    fontSize: 13,
    color: "#888",
  },

  cardAmount: {
    fontSize: 16,
    color: "#4CAF50", // 綠色表示支付金額
    fontWeight: "600",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "600",
  },

});

