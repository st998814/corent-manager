import React from 'react';
import './Home.css'
import { useState, useEffect } from "react";


const PaymentNotification=()=>{
    const initialRentDate=new Date("2025-07-18")
    const[nextRentDate, setNextRentDate] = useState(initialRentDate);


    useEffect(()=>{


      const today=new Date();
      let nextDate=new Date(initialRentDate)

      while (nextDate<=today){
        nextDate.setDate(nextDate.getDate()+14);
      }
      setNextRentDate(nextDate);
},[])

    const rent = {
      amount: 950,
      dueDate: nextRentDate.toLocaleDateString("zh-TW"), 
      status: "pending",
  };


}
const Home: React.FC = () => {
  return (
    <div className="p-6">
      {/* 原本的標題 */}
      <h1 className="title mb-6">Building...</h1>

      {/* Payment Due card*/}
      <div className="flex flex-wrap mt-6 -mx-3">
        <div className="w-full max-w-full px-3 mt-0 lg:w-7/12 lg:flex-none">
          <div className="border border-black/20 dark:bg-slate-800 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col rounded-2xl bg-white">
            <div className="border-b border-black/10 mb-0 rounded-t-2xl border-solid p-6 pt-4 pb-0">
              <h6 className="capitalize dark:text-white text-center" >Payment Due Notification</h6>
              <p className="mb-0 text-sm leading-normal dark:text-white dark:opacity-60">
                <i className="fa fa-arrow-up text-emerald-500"></i>
                <span className="font-semibold"> Rent </span> 
                <span className='font-semibold'>AU${rent.anount}</span>
                <span className='font-semibold'>Due : {rent.dueDate}</span>
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
