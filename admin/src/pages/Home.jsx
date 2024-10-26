import React from 'react'
import { Charts } from '../components/Charts'
import { Profit } from '../components/Profit'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { backendUrl } from '../App'

const Home = ({token}) => {

  
  const {data: Allstats}=useQuery({
    queryKey:['Allstats',token],
    queryFn: async()=>{
      try {
        const response=await axios.post(backendUrl+"/api/admin/totalstats",{},{headers:{token}}) 
        if(response.data.success){
          return response.data;
        }
        
      } catch (error) {
        toast.error('error fetching stats')
      }
    }

  })


  const {userCount,productCount,orderCount,salesCount}=Allstats || {};
  
 
  return (
    <div className='max-h-screen overflow-y-auto'>
       <div className="mx-auto max-w-screen-xl px-2 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-3xl font-bold text-purple-900 sm:text-4xl">Trusted by eCommerce Businesses</h2>

    <p className="mt-4 text-purple-950 sm:text-md">
    provides a user-friendly interface for managing orders, with easy options to add, delete, and view total orders. Quick-access features ensure efficient navigation and streamlined order management. Perfect for keeping track of store activity effortlessly.
    </p>
  </div>

  <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
    <div className="flex flex-col rounded-lg bg-purple-50 px-4 py-8 text-center shadow-xl">
      <dt className="order-last text-lg font-medium text-purple-950">Total Customers</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">{userCount}</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-purple-50 px-4 py-8 text-center shadow-lg">
      <dt className="order-last text-lg font-medium text-purple-950">Total products</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">{productCount}</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-purple-50 px-4 py-8 text-center shadow-md">
      <dt className="order-last text-lg font-medium text-purple-950">Total Orders</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">{orderCount}</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-purple-50 px-4 py-8 text-center shadow-sm">
      <dt className="order-last text-lg font-medium text-purple-950">Total sales</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">{salesCount}</dd>
    </div>
  </dl>
</div>




   <Charts token={token}/>
   
   <Profit token={token}/>


    </div>
  )
}

export default Home