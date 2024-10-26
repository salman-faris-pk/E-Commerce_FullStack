import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios'
import { backendUrl } from '../App'



export const Charts = ({token}) => {


    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {       
          const response = await axios.post(backendUrl+ '/api/admin/charts',{},{headers: {token}}); 
            
          if (response.data.success) {
            const formattedData = response.data.data.map(item => ({
              name: item.name, 
              order: item.count, 
            }));          
            setData(formattedData);
          }
        } catch (error) {
          console.error('Error fetching chart data:', error);
        }
      };
  
      fetchData();
    }, []);


  return (
    <div>
        <h1 className='mb-5 mt-16 md:ms-12 font-semibold text-xl text-purple-950'>Order Graph</h1>
     <ResponsiveContainer width={'100%'} height={350}>
      <BarChart width={150} height={40} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="5 5" />
        <Bar dataKey="order" fill="#8884d8" barSize={80} />
      </BarChart>
    </ResponsiveContainer>
    </div>
  )
}
