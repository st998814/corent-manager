import ToggleSplit from "./ToggleButton";

interface Rent {
  amount: number;
  dueDate: string;
  status: string;
}

interface Utilities {
  internet: {
    amount: number;
    dueDate: string;
    status: string;
  };
    electricity: {
        amount: number;
        dueDate: string;
        status: string;
    };
    gas: {
        amount: number;
        dueDate: string;
        status: string;
    };
}
const PaymentNotification = ({ rent,utilities }: { rent: Rent ,utilities:Utilities}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 " >
        <div className="flex justify-end mt-2">
        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Pay
        </button> */}
        <ToggleSplit />
        </div>
      <h3 className="text-lg font-bold text-black">Rent</h3>
      <p className="text-xl font-semibold  text-black">${rent.amount}</p>
      <p className="text-sm text-black">Due: {rent.dueDate}</p>
      
      {/* <span className="text-yellow-500 font-bold">
        {rent.status === "pending" ? "待支付" : "已逾期"}
      </span> */}
      <h3 className="text-lg font-bold text-black">Utilities</h3>
      <p className=".text-base font-bold  text-black">Internet</p>
        <p className="text-sm text-black">Amount: ${utilities.internet.amount}</p>      
        <p className="text-sm text-black">Due: {utilities.internet.dueDate}</p>
        <p className=".text-base font-bold  text-black">Electricity</p>

        <p className="text-sm text-black">Amount: ${utilities.electricity.amount}</p>
        <p className="text-sm text-black">Due: {utilities.electricity.dueDate}</p>
        <p className=".text-base font-bold  text-black">Gas</p>
        <p className="text-sm text-black">Amount: ${utilities.gas.amount}</ p>
        <p className="text-sm text-black">Due: {utilities.gas.dueDate}</p>

      
    </div>
  );
};

export default PaymentNotification;