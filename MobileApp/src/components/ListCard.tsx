import React from 'react';
import { TouchableOpacity, Text,StyleSheet ,View} from 'react-native';
import { useTheme } from "../context/ThemeContext";



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

type GroupData = {
  id: string;
  
  name: string;
  email: string;
  description?: string; // optional for future use
  
};


// props for the ListCard component
type ListCardProps = {
  paymentData?: PaymentData;
  requestData?: RequestData;
  groupData?: GroupData; // optional for future use
  style?: object; // optional style prop for custom styling
  onPress: () => void;
  disabled?: boolean;
};


export default function ListCard({ groupData,paymentData, requestData, onPress, disabled = false }: ListCardProps) {
const { isDarkMode } = useTheme();
const styles = createStyles(isDarkMode);
const isPaymentCard = !!paymentData;
  const data = paymentData || requestData || groupData;

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
        // 如果是群組卡片
        {!isPaymentCard && !requestData && groupData && (
          <>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{groupData.name}</Text>
              <Text style={styles.cardStatus}>{groupData.email}</Text>
            </View>
   
          </>
        )}
        <Text style={styles.cardDescription}>
            {isPaymentCard ? paymentData.description : requestData?.description || groupData?.description || "No description available"}

        </Text>

    </TouchableOpacity>
  );
}

const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  card: {
    backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
    borderRadius: 8,
    padding: 18,
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

  cardDescription: {
    fontSize: 13,
    color: isDarkMode ? "#999" : "#888",
  },

  cardAmount: {
    fontSize: 16,
    color: "#4CAF50", // 綠色表示支付金額
    fontWeight: "600",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: isDarkMode ? "#fff" : "#000",
  },
});

