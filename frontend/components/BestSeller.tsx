"use client"
import Title from './Title';
import { ProductItem } from './ProductItem';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { backendUrl } from '@/app/page';
import { toast } from 'react-toastify';


export const BestSeller = () => {

  
 const {data: bestSeller}=useQuery({
  queryKey:["bestsell"],
  queryFn: async()=>{
      try {
        const response= await axios.get(backendUrl+"/api/product/best-sellers");
         if(response.data.success){
           return response.data.bestSells;
         }else{
          toast.error(response.data.message)
         }
        
      } catch (error:any) {
        toast.error(error.message)
      }
  },

    refetchInterval: 10000,
 })



  return (
    <div className='my-10'>
       <div className='text-center text-3xl py-8'>
         <Title text1={`BEST`} text2={'SELLERS'}/>
         <p className='w-3/4 m-auto text-xs sm:text-sm  md:text-base text-gray-600'>
         Our top-selling products, chosen for their exceptional quality and popularity, perfect for enhancing your lifestyle.
         </p>
       </div>


       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
         {
            bestSeller && bestSeller.map((item:any)=> (
                <ProductItem _id={item._id} image={item.image[0]} name={item.name} price={item.price} key={item._id}/>
            ))
         }
       </div>
    </div>
  )
}
