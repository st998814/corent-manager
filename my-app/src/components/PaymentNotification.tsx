import { renderToPipeableStream } from "react-dom/server";
import React, { useState } from 'react';
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
interface PaymentNotificationProps {
  rent: Rent;
  utilities: Utilities;
  isSplit: boolean;
  onToggle: (value: boolean) => void;
}



//    // function to show split in 3 or total amount
//    const splitAmount = (amount: number, isSplit: boolean) => {
//     return isSplit ? (amount / 3).toFixed(2) : amount.toFixed(2);       

//     }   
//     const totalAmount=[]


const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  rent,
  utilities,
  isSplit,
  onToggle,
}) => {
  const splitAmount = (amount: number) =>
    Math.round((amount / 3) * 100) / 100; // 三人平分

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* 右上角的切換按鈕 */}
      <div className="flex justify-end">
        <ToggleSplit isSplit={isSplit} onToggle={onToggle} />
      </div>

      <h3 className="text-lg font-bold text-black">Rent</h3>
      <p className="text-xl font-semibold text-black">
        ${isSplit ? splitAmount(rent.amount) : rent.amount}
      </p>
      <p className="text-sm text-black">Due: {rent.dueDate}</p>

      <h3 className="text-lg font-bold text-black mt-4">Utilities</h3>
      <p className="font-bold text-black">Internet</p>
      <p className="text-sm text-black">
        Amount: $
        {isSplit
          ? splitAmount(utilities.internet.amount)
          : utilities.internet.amount}
      </p>
      <p className="text-sm text-black">Due: {utilities.internet.dueDate}</p>

      <p className="font-bold text-black">Electricity</p>
      <p className="text-sm text-black">
        Amount: $
        {isSplit
          ? splitAmount(utilities.electricity.amount)
          : utilities.electricity.amount}
      </p>
      <p className="text-sm text-black">Due: {utilities.electricity.dueDate}</p>

      <p className="font-bold text-black">Gas</p>
      <p className="text-sm text-black">
        Amount: $
        {isSplit
          ? splitAmount(utilities.gas.amount)
          : utilities.gas.amount}
      </p>
      <p className="text-sm text-black">Due: {utilities.gas.dueDate}</p>
    </div>
  );
};
export default PaymentNotification;