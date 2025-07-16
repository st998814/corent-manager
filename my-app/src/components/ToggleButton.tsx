import { useState } from 'react';

const ToggleSplit: React.FC = () => {
  const [isSplit, setIsSplit] = useState(false);

  {/*const toggleMode = () => setIsSplit((prev) => !prev);*/}
    return (
    <label className="inline-flex items-center cursor-pointer">
      {/* the implementation of swtich toggle is based on checkbox*/}
      <input
        type="checkbox"
        checked={isSplit}
        onChange={() => setIsSplit((prev) => !prev)}
        className=" sr-only peer"
      />   
    {/* toggle background */}
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
          isSplit ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        {/* toggle dot */}
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${
            isSplit ? 'translate-x-5' : ''
          }`}
        ></div>
      </div> 

      <span className="ms-3 text-sm font-medium text-gray-900">
        {isSplit ? "三人平分" : "總計金額"}
      </span>
    </label>
  );
};



export default ToggleSplit;