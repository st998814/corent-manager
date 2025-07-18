import React from 'react';
import './Home.css'
import { useState, useEffect } from "react";
import PaymentNotification from '../components/PaymentNotification';
import Timebar from '../components/Timebar';


// import ToggleSplit from "../components/ToggleButton";
// const PaymentNotification=()=>{
//     const initialRentDate=new Date("2025-07-18")
//     const[nextRentDate, setNextRentDate] = useState(initialRentDate);


//     useEffect(()=>{


//       const today=new Date();
//       let nextDate=new Date(initialRentDate)

//       while (nextDate<=today){
//         nextDate.setDate(nextDate.getDate()+14);
//       }
//       setNextRentDate(nextDate);
// },[])

//     const rent = {
//       amount: 950,
//       dueDate: nextRentDate.toLocaleDateString("zh-TW"), 
//       status: "pending",
//   };


// }

    // const splitAmount = (amount: number) => {
    //   return  Math.round((amount / 3) * 100) / 100 ;       
    // }



const Home: React.FC = () => {
    
    // handle split toggle state
  const [isSplit, setIsSplit] = useState(false);

  
  const initialRentDate = new Date("2025-07-18");
  const calculateNextRent = (initialDate: Date) => {
    const today = new Date();
    let nextDate = new Date(initialDate);

    while (nextDate <= today) {
      nextDate.setDate(nextDate.getDate() + 14);
    }

    return {
      amount: 950,
      dueDate: nextDate.toLocaleDateString("zh-TW"),
      status: today > nextDate ? "overdue" : "pending",
    };
  };
  // or maybe create another variable such as "initial internet date" to calculate next internet payment due date
  // and so on for other utilities

  const initialInternetDate = new Date("2025-08-01")
  const calculateNextInternetPayment = (initialDate: Date) => {
    const today = new Date();
    let nextDate = new Date(initialDate);   
    while (nextDate <= today) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return {
      amount: 85, // example amount, can be updated
      dueDate: nextDate.toLocaleDateString("zh-TW"),
      status: today > nextDate ? "overdue" : "pending", //need to be updated based on actual status ,still think about how to do it.
    };
  };
  const initialElectricityDate = new Date("2025-09-18")         
  const calculateNextElectricityPayment = (initialDate: Date) => {  
    const today = new Date();
    let nextDate = new Date(initialDate);
    while (nextDate <= today) {
      nextDate.setMonth(nextDate.getMonth() + 3);
    }
    return {
      amount: 100,
      dueDate: nextDate.toLocaleDateString("zh-TW"),
      status: today > nextDate ? "overdue" : "pending",
    };
    };
    const initialGasDate = new Date("2025-09-22")
  const calculateNextGasPayment = (initialDate: Date) => {
    const today = new Date();
    let nextDate = new Date(initialDate);
    while (nextDate <= today) {
      nextDate.setMonth(nextDate.getMonth() + 3);
    }
    return {
      amount: 60,
      dueDate: nextDate.toLocaleDateString("zh-TW"),
      status: today > nextDate ? "overdue" : "pending",
    };
    }


    
    const rent = calculateNextRent(initialRentDate);
    const utilities = {
      internet: calculateNextInternetPayment(initialInternetDate),
      electricity: calculateNextElectricityPayment(initialElectricityDate),
      gas: calculateNextGasPayment(initialGasDate),
    };

    // const utilities = {
    //   internet: {
    //     amount: 85,
    //     dueDate: "2025-07-20",
    //     status: "pending", //need to be updated based on actual status ,still think about how to do it.
    //   },
    //   electricity: {
    //     amount: 100,
    //     dueDate: "2025-07-22",
    //     status: "pending", //need to be updated based on actual status ,still think about how to do it.
    //   },
    //   gas: {
    //     amount: 30,
    //     dueDate: "2025-07-25",
    //     status: "pending", //need to be updated based on actual status ,still think about how to do it.
    //   },
    // };

    // function to show split in 3 or total amount



  return (
    <div className="p-6">
      {/* 原本的標題 */}
      <h1 className="title mb-6">Building...</h1>
      <Timebar />

      
      {/* Payment Due card*/}
      <div className="flex flex-wrap mt-6 -mx-3">
        <div className="w-full max-w-full px-3 mt-0 lg:w-7/12 lg:flex-none">
          <div className="border border-black/20 dark:bg-slate-800 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col rounded-2xl bg-white">
            <div className="border-b border-black/10 mb-0 rounded-t-2xl border-solid p-6 pt-4 pb-0">
              <h6 className="capitalize dark:text-white text-center" >Payment Due Notification</h6>
              {/* inner card */}
              <p className="mb-0 text-sm leading-normal dark:text-white dark:opacity-60" id="payment-notification ">

                <PaymentNotification rent={rent} utilities={utilities} isSplit={isSplit} onToggle={setIsSplit}/>
                
                {/* <i className="fa fa-arrow-up text-emerald-500"></i> */}
                {/* <span className="font-semibold"> Rent </span> 
                <span className='font-semibold'>AU${rent.anount}</span>
                <span className='font-semibold'>Due : {rent.dueDate}</span> */}
              </p>
            </div>
            {/* <div className="flex-auto p-4">
              <div>
                <canvas id="chart-line" height="300"></canvas>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Recent Activity*/}
        <div className="flex flex-wrap mt-6 -mx-3">
         <div className="w-full max-w-full px-3 mt-0 lg:w-7/12 lg:flex-none">
          <div className="border border-black/20 dark:bg-slate-800 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col rounded-2xl bg-white">
            <div className="border-b border-black/10 mb-0 rounded-t-2xl border-solid p-6 pt-4 pb-0">
              <h6 className="capitalize dark:text-white text-center" >Recent Activity</h6>
              <p className="mb-0 text-sm leading-normal dark:text-white dark:opacity-60">
                <i className="fa fa-arrow-up text-emerald-500"></i>
                <span className="font-semibold"> 4% more </span> in 2021
              </p>
            </div>
            <div className="flex-auto p-4">
              <div>
                <canvas id="chart-line" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      


  );
};

export default Home;
