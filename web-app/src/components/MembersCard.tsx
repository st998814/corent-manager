import React, { use } from 'react'


import { Disclosure, DisclosureButton } from '@headlessui/react';
import { useState, useEffect } from 'react';


import axios from "axios";

interface User {
  id: number;
  name: string;


}
const MembersCard = () => {
  // State to hold the list of users
  const [users, setUsers] = useState<User[]>([]);
  // Fetch users from the backend when the component mounts
  const [loading, setLoading] = useState(true);
  
  const fetchUsers = async () => {

    try {
      const res = await axios.get("http://localhost:8080/api/users/fetchAll");
      setUsers(res.data)
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;


  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-6">

        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <><span className="font-semibold text-black">{user.name}</span></>

            </li>
          ))}

        </ul>
      </div>
      
    </div>
  )
}

export default MembersCard;
