interface Rent {
  amount: number;
  dueDate: string;
  status: string;
}

const PaymentNotification = ({ rent }: { rent: Rent }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold text-black">Rent</h3>
      <p className="text-xl font-semibold  text-black">${rent.amount}</p>
      <p className="text-sm text-black">Due: {rent.dueDate}</p>
      {/* <span className="text-yellow-500 font-bold">
        {rent.status === "pending" ? "待支付" : "已逾期"}
      </span> */}
    </div>
  );
};

export default PaymentNotification;