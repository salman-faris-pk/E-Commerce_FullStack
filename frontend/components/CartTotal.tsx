"use client"
import React from 'react'
import Title from './Title'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toast } from 'sonner';


type Total={
  subtotal: number;
  totalAmount: number
}

export const CartTotal = () => {

  const {token}=useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

   
    const currency="₹";
   
    const {data:total}=useQuery<Total>({
      queryKey:["totalprice",token],
      queryFn: async()=>{
        const res=await axios.get(backendUrl+"/api/user/totalprice",{
          headers:{ token }
        })
        
        
        if(res.data.success){
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          return res.data
        }else{
          toast.error(res.data.message)
        }
      },

        enabled: !!token,                 
        refetchOnWindowFocus: true,  
    })
 
    
  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'}/>
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
            <p>Subtotal</p>
            <p>{currency}{total?.subtotal}.00</p>
        </div>
        <hr/>
        <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency}{60}.00</p>
        </div>
        <hr/>
        <div className='flex justify-between'>
            <b>Total</b>
            <b>{currency} {total?.totalAmount}.00</b>
        </div>

      </div>

    </div>
  )
}
