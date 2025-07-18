
import React from "react";

import plusIcon from "../assets/plus.png";
interface AddButtonProps {  onClick: () => void;
  
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, className }) => {
    return (
    <button
      onClick={onClick}
      
      className={`flex gap-2 px-3 py-2 cursor-pointer ${className}`}
    >
      <img src={plusIcon} alt="Add" className="w-5 h-5" />
      
    </button>

   
  );
};


export default AddButton;
// AddButton component can be used to trigger actions like adding new items, etc.
// It accepts an onClick function, a label for the button, and optional className for styling.
// Example usage:
// <AddButton onClick={() => console.log('Add clicked')} label="Add Item" className="bg-blue-500 text-white" />
// This will render a button with the label