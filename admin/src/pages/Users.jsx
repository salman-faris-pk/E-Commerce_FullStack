import React, { useEffect, useState } from 'react';
import axios from "axios"
import { backendUrl } from "../App";



const Users = ({token}) => {
  
  
  const [userStats, setUserStats] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.post(backendUrl+"/api/admin/user-list",{},{headers: {token}}) 
        if (response.data.success) {
         setUserStats(response.data.userStats); 
        }
      
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchUserStats(); 
  }, []);

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error}</div>; 

  return (
    <div className="max-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-x-auto max-h-screen overflow-y-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-purple-900 text-white/90">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">E-mail</th>
                <th className="py-3 px-6 text-left">Purchase count</th>
                <th className="py-3 px-6 text-left">Spent Amount</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((user) => (
                <tr className="border-b" key={user.userId}>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.purchaseItemCount}</td>
                  <td className="py-3 px-6">₹ {user.totalAmountSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
