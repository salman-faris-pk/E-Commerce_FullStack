"use client"
import Title from '@/components/Title'
import { RootState } from '@/store/store'
import React, { useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { CartTotal } from '@/components/CartTotal'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { backendUrl } from '../page'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';





 const Cartpage = () => {

     
  const {token}=useSelector((state: RootState) => state.user);


    var currency="₹";
    
  const queryClient = useQueryClient();
    
    const router=useRouter()


    const { data: cartData} = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
          try {
            const response = await axios.post(
              backendUrl + "/api/user/cart",
              {}, 
              {
                headers: {
                     token 
                },
              }
            );
            
            if (token && response.data.success) {
              return response.data.cartData; 
            } else {
              toast.error(response.data.message);
              return []; 
            }
            
          } catch (error) {
            toast.error("Failed to fetch cart data");
            return []; 
          }
        },

        enabled: !!token,                 
        refetchOnWindowFocus: true,  
        staleTime: 1000,    
      });
      

      const updateCartMutation = useMutation({
        mutationFn: async ({ cartId, quantity }: { cartId: string, quantity: number }) => {
          try {
            const response = await axios.patch(
              backendUrl + "/api/user/updatecart",
              { cartId, quantity }, 
              {
                headers: {
                  token
                }
              }
            );
            if (response.data.success) {
              queryClient.invalidateQueries({ queryKey: ["cart"] });
              queryClient.invalidateQueries({ queryKey: ["totalprice"] });

              
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            toast.error("Failed to update cart");
          }
        }
      });
    
  


      const handleQuantityChange = (cartId: string, newQuantity: number) => {
        if (newQuantity < 1) return ;
        updateCartMutation.mutate({ cartId, quantity: newQuantity });
      };


      const handleDelete = async (cartId:string) => {
        try {
          const response = await axios.delete(backendUrl + '/api/user/deletCart', {
            headers: {
              token
            },
            data: { cartId },
          });
      
          if (response.data.success) {
            toast.success('Item removed from cart');
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["totalprice"] });

            
          }
        } catch (error) {
          toast.error('Failed to delete cart item');
        }
      };
      

  return (
    <div className='border-t pt-14'>
       <div className='text-2xl mb-3'>
         <Title text1={'YOUR'} text2={'CART'}/>
       </div>

       <div className='max-h-[65vh] sm:max-h-[100vh] overflow-y-auto'>
  {cartData &&
    cartData.map((item: any, index: any) => {
        const product = item.productId; 
      return (
        <div
          key={index}
          className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
        >
          <div className='flex items-start gap-6'>
            <img
              src={product&&product.image[0]}
              alt='img'
              className='w-16 sm:w-20'
            />
            <div>
              <p className='text-xs sm:text-lg font-medium'>
                {product&&product.name}
              </p>
              <div className='flex items-center gap-5 mt-2'>
                <p>
                  {currency}
                  {item?.price}
                </p>
                <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>
                  {item.size}
                </p>
              </div>
            </div>
          </div>

          <input
            type='number'
            min={1}
            max={15}
            value={item.quantity}
            className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
            
          />
          <RiDeleteBin6Line
            className='cursor-pointer mr-4 text-gray-500'
            size={24}
            onClick={() => handleDelete(item._id)}
          />
        </div>
      );
    })}
</div>


       <div className='flex justify-end my-20 '>
        <div className='w-full sm:w-[450px]'>
         <CartTotal />
         {cartData&&cartData.length === 0 ? (
             <div className='w-full text-end'>
             <button className='bg-black cursor-none text-white text-sm my-8 px-8 py-3'>
                 PROCEED TO CHECKOUT
             </button>
          </div>
         ):(
          <div className='w-full text-end'>
          <button className='bg-black  text-white text-sm my-8 px-8 py-3' onClick={()=>  router.push("/cart/place-order")}>
              PROCEED TO CHECKOUT
          </button>
       </div>
         )}
        
        </div>          
       </div>



    </div>
  )
}

export default Cartpage; 