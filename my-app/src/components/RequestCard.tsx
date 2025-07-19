import React, { useState } from 'react';
// import components
import AddButton from '../components/AddButton';
import RequestForm from '../components/RequestForm';


interface Request {
  title: string;
  description: string;
  status: string; 
}


// Define of component PublicRequestCard
const PublicRequestCard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
    const [requests, setRequests] = useState<Request[]>([
    {
      title: "Request for Maintenance",
      description: "The heating system is not working properly.",
      status: "Pending",
    },
    {
      title: "Request for Cleaning",
      description: "The common area needs cleaning.",
      status: "Completed",
    },
  ]);

    const handleAddRequest = (data: { title: string; description: string }) => {
       const newRequest: Request = { ...data, status: "Pending" }; 
       setRequests((prev) => [newRequest, ...prev]); // 
       setShowForm(false);
  };





  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-end">
        <AddButton onClick={() => setShowForm(true)} />
      </div>

      {/* show the form when variable:showForm(boolean) is true */}
      {showForm && (
        <RequestForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddRequest}
        />
      )}
      {requests.map((req, index) => (
        <div key={index} className="mb-4 text-black">
          <h3 className="text-lg font-bold">{req.title}</h3>
          <p>{req.description}</p>
          <p>{req.status}</p>
        </div>
      ))}



    </div>
  );
};

export default PublicRequestCard;