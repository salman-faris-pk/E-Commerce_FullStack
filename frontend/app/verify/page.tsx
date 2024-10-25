"use client"
import axios from 'axios';
import { useSearchParams ,useRouter} from 'next/navigation';
import React, { useEffect } from 'react'
import { backendUrl } from '../page';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const page = () => {
   
    const { token }=useSelector((state: RootState) => state.user);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();  
    const success= searchParams.get('success')
    const orderId= searchParams.get('orderId')
    const router=useRouter()

    const verifyPayment= async()=>{
        try {
            
            if(!token){
                router.replace("/login")
                return null;
            }
            const res=await axios.post(backendUrl+"/api/order/verifystripe",{success,orderId},{
                headers:{ token }
            });
            if(res.data.success){
              queryClient.invalidateQueries({ queryKey: ["cart"] });
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              router.replace("/orders");
            }else{
                router.replace("/cart");
            }
            
        } catch (error:any) {
            toast.error(error.message)
            
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [token, success, orderId]);
    
  return (
    <div className='flex items-center justify-center'>
      <img src='/payment.png' alt='success' className='w-52 h-32'/>
    </div>
  )
}

export default page