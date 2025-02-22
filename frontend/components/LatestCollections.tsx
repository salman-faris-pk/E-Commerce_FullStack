"use client"
import Title from './Title'
import { ProductItem } from './ProductItem'
import axios from "axios"
import { backendUrl } from '../utils/backendUrl';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AllProducts } from "../app/types/AllTypes"



const LatestCollections = () => {


 const {data: latestdata,isLoading}=useQuery<AllProducts[]>({
  queryKey:["latestpro"],
  queryFn: async()=>{
      try {
        const response= await axios.get(backendUrl+"/api/product/latest-products");
         if(response.data.success){
           return response.data.lastTenProduct;
         }else{
          toast.error(response.data.message)
         }
        
      } catch (error:unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          } else {
          toast.error("An unknown error occurred");
         }
      }
  },

    refetchInterval: 10000,
 })



  return (
    <div className='my-10'>
       <div className='text-center py-8 text-3xl'>
          <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Explore our latest collection of must-have dresses, curated to elevate your style and comfort.
          </p>
       </div>
        {
          isLoading && <p>Loading.....</p>
        }

       {latestdata && (
           <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
           {
               latestdata.map((item:AllProducts)=> (
                   <ProductItem _id={item._id} image={item.image[0]} name={item.name} price={item.price} key={item._id}/>
               ))
           }
        </div>
       )}

        
    </div>
  )
}

export default LatestCollections

