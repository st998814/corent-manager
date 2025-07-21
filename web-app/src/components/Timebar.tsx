import React from 'react';


const totalDate=365
const completedDate=28
const progress = (completedDate / totalDate) * 100;

const Timebar: React.FC = () => {
  return (
    <div>
      <div>Spent {completedDate}/{totalDate} days</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>

  );
};

export default Timebar;

