"use client"
import Title from '@/components/Title'
import { RootState } from '@/store/store'
import React from 'react'
import { CartTotal } from '@/components/CartTotal'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { backendUrl } from '../../utils/backendUrl'
import { toast } from 'sonner'
import { useSelector } from 'react-redux';
import Image from 'next/image'
import { Trash2 } from 'lucide-react'


interface Product {
  image: string[];
  name: string;
}
interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  price: number;
  size: string;
}
type CartData = CartItem[];

 const Cartpage = () => {

     
  const {token}=useSelector((state: RootState) => state.user);


    const currency="₹";
    
  const queryClient = useQueryClient();
    
    const router=useRouter()


    const { data: cartData,isLoading} = useQuery<CartData>({
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
            
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error(`Failed to fetch cart data: ${error.message}`);
          } else {
              toast.error("Failed to fetch cart data");
          }
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
          } catch (error:unknown) {
            if (error instanceof Error) {
              toast.error(error.message);
              } else {
              toast.error("An unknown error occurred");
             }
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
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
            } else {
            toast.error("An unknown error occurred");
           }
        }
      };
      

  return (
    <div className='border-t pt-14'>
       <div className='text-2xl mb-3'>
         <Title text1={'YOUR'} text2={'CART'}/>
       </div>

       {isLoading && <p>Loading...</p>}

       <div className='max-h-[65vh] sm:max-h-[100vh] overflow-y-auto'>
       {cartData &&
      cartData.map((item, index) => {
        const product = item.productId; 
      return (
        <div
          key={index}
          className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
        >
          <div className='flex items-start gap-6'>
            <Image
              src={product&&product.image[0]}
              alt='img'
              width={64}
              height={70}
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
          <Trash2
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
          {isLoading &&  <div className="border-t-4 border-blue-500 border-solid w-5 h-5 rounded-full animate-spin"></div>}
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