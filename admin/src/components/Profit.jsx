import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import axios from 'axios'
import { backendUrl } from '../App'

export const Profit = ({token}) => {


  const {data: Balance}=useQuery({
    queryKey:['profits',token],
    queryFn: async()=>{
      try {
        const response=await axios.post(backendUrl+"/api/admin/profits",{},{headers:{token}})
        
        if(response.data.success){
          return response.data;
        }
        
      } catch (error) {
        toast.error('error fetching profits')
      }
    }

  })

  const { Profit, profitPer, pending, pendingPer } = Balance?.data || {};
  

  return (
    <div className='mt-16 flex flex-col md:items-end mb-10'>
        <article className="flex items-end justify-between mb-2 md:w-[400px] rounded-lg border border-gray-100 bg-purple-50 p-6">
   <div>
    <p className="text-sm text-gray-500">Profit</p>

    <p className="text-2xl font-medium text-purple-950">₹{Profit || 'N/A'}</p>
  </div>

  <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>

    <span className="text-xs font-medium">{profitPer || '0'}%</span>
  </div>
</article>

<article className="flex items-end justify-between md:w-[400px] rounded-lg border border-gray-100 bg-purple-50 p-6">
  <div>
    <p className="text-sm text-gray-500">Pending Profit</p> 

    <p className="text-2xl font-medium text-purple-950">₹{pending || 'N/A'}</p>
  </div>

  <div className="inline-flex gap-2 rounded bg-red-100 p-1 text-red-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
      />
    </svg>

    <span className="text-xs font-medium">{pendingPer || '0'}%</span>
  </div>
</article>
    </div>
  )
}
