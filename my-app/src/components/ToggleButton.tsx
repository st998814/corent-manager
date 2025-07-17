import React from "react";

interface ToggleSplitProps {
  isSplit: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSplit: React.FC<ToggleSplitProps> = ({ isSplit, onToggle }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isSplit}
        onChange={() => onToggle(!isSplit)}
        className="sr-only peer"
      />
      {/* switch background */}
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
          isSplit ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        {/* switch dot */}
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
            isSplit ? "translate-x-5" : ""
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