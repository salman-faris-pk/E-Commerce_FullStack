import React, { useEffect, useState } from 'react'
import axios from "axios"
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { BiSolidPackage } from "react-icons/bi";
import { useQuery, useQueryClient } from '@tanstack/react-query'

const Orders = ({token}) => {

const queryClient = useQueryClient();
   
  
  const { data: orders= [] } = useQuery({
     queryKey:['orders', token], 
     queryFn:async () => {
      if (!token) {
        throw new Error('No token provided');
      }

      const response = await axios.post(`${backendUrl}/api/order/list-all`, {}, {
        headers: { token },
      });

      if (response.data.orders) {
        return response.data.orders;
      } else {
        toast.error(response.data.message);
        return [];
      }
    },
    
      enabled: !!token,
      onError: (error) => {
        toast.error(error.message);
      },
      refetchOnWindowFocus: true,
      refetchInterval: 5000, 
    
});


  


    const statusHandler=async(event,orderId)=>{
       try {

        const response=await axios.post(backendUrl+"/api/order/status",{orderId,status:event.target.value},{
          headers:{ token }
        });

        if(response.data.success){
         queryClient.invalidateQueries({ queryKey: ["orders"] });
           
        }
        
       } catch (error) {
        console.log(error);
        toast.error(response.data.message)
       }
    }

  

  return (
    <div>
       <h3>Orders({orders.length})</h3>
       <div>
         {
          orders && orders.reverse().map((order,index)=> (
            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 
              items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
                <span className='md:border md:flex items-center justify-center md:p-1 md:me-4'>
                <BiSolidPackage size={45} className='text-gray-600'/>
                </span>
              <div>
              <div>
                {order.items.map((item,i)=>{
                  if(i === order.items.length - 1){
                     return <p className='py-0.5' key={i}>{item.name} x {item.quantity} <span>{item.size}</span></p>
                  }else{
                    return <p className='py-0.5' key={i}>{item.name} x {item.quantity} <span>{item.size}</span>,</p>
                    
                  }
               })}
              </div>
               <p className='mt-3 mb-3 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
               <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>

            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date:  {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-sm sm:text-[15px]'>₹ {order.amount}</p>
            <select onChange={(event)=> statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out of delivery">Out of delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
              
            </div>
          ))
        }
     </div>



    </div>
  )
}

export default Orders