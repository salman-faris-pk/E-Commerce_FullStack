"use client"
import { backendUrl } from '../../../utils/backendUrl'
import { CartTotal } from '@/components/CartTotal'
import Title from '@/components/Title'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { AllFormData,Order,RazorpayResponse} from "../../types/AllTypes"
import Image from 'next/image'
import stripeImge from "@/public/stripe.png"
import razorimg from "@/public/razor.png"
import { RazorpayOptions } from '@/razorpay'




const PlaceOrderpage = () => {
  
  const router=useRouter()
  const queryClient = useQueryClient();

  const [selected,setSelected]=useState('cod')
  const [formData,setFormdata]=useState<AllFormData>({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:null,
    country:"",
    phone:null
  })

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const parsedValue = value ? (name === 'zipcode' || name === 'phone' ? Number(value) : value) : null;

    setFormdata(data => ({ ...data, [name]: parsedValue }));
};


  const initPay=(order: Order)=>{    //for opens a window of razorpay 
      const options: RazorpayOptions ={
         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
         amount: order.amount,
         currency: order.currency,
         name: 'Order payment',
         description: 'Order payment',
         order_id: order.id,
         receipt: order.receipt,
         handler: async(response: RazorpayResponse)=> {
           const Token=localStorage.getItem('token')
           if(!Token){
            toast.info("please login")
            return null;
           }
           try {
            const { data }=await axios.post(backendUrl+"/api/order/verifyrazor",response,{headers:{Token}})
            if(data.success){
               router.replace('/orders')
               queryClient.invalidateQueries({ queryKey: ["cart"] });
               queryClient.invalidateQueries({ queryKey: ["orders"] });
            }
            
           } catch (error:unknown) {
            if (error instanceof Error) {
              toast.error(error.message);
             } else {
              toast.error("An unknown error occurred");
             }
           }
         }
      }
      const rzp= new window.Razorpay(options)
      rzp.open()
  }


  const handleSubmitHandler=async(event:React.FormEvent<HTMLFormElement>)=>{

      event.preventDefault()
  
      try {
        const token=localStorage.getItem('token')

        const orderData={
          address: formData
        }

        if (!token) {
          toast.error("Please login to place an order");
          router.replace("/login")
          return null;
        }

        switch(selected){
          
          case 'cod':
           const response=await axios.post(backendUrl+"/api/order/place-order",orderData,{
             headers:{ token }
           });
             
           if(response.data.success){
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            router.replace("/orders");
           }else{
            toast.error(response.data.message)
           }
          break;


          case 'stripe':
            const responseStripe=await axios.post(backendUrl+ "/api/order/stripe",orderData,{
              headers: { token }
            });
            if(responseStripe.data.success){
              const { session_url }=responseStripe.data
              window.location.replace(session_url) //this navigates to verify page

              queryClient.invalidateQueries({ queryKey: ["cart"] });
              queryClient.invalidateQueries({ queryKey: ["orders"] });


            }else{
              toast.error(responseStripe.data.message)
            }
            break;


            case 'razor':
              const responseRazor=await axios.post(backendUrl+"/api/order/razor",orderData,{
                headers: { token }
              })

              if(responseRazor.data.success){
                 initPay(responseRazor.data.order)
                 queryClient.invalidateQueries({ queryKey: ["cart"] });
                 queryClient.invalidateQueries({ queryKey: ["orders"] });
              }
            break;

          default:
            break;
        }
        
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          } else {
          toast.error("An unknown error occurred");
          }
      }
  }


  return (
    <form className='flex flex-col sm:flex-row justify-between  gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'
      onSubmit={handleSubmitHandler}
    >
      
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
                <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
          </div>
          <div className='flex gap-3'>
             <input type="text" placeholder='First name' value={formData.firstName ?? ''} name='firstName' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
             <input type="text" placeholder='Last name' value={formData.lastName ?? ''} name='lastName' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          </div>

           <input type="email" placeholder='Email address' value={formData.email ?? ''} name='email' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
            <input type="text" placeholder='Street' value={formData.street ?? ''} name='street' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
        
            <div className='grid grid-cols-2 gap-3'>
             <input type="text" placeholder='City' value={formData.city ?? ''} name='city' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
             <input type="text" placeholder='State' value={formData.state ?? ''} name='state' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
             <input type="number"  value={formData.zipcode ?? ''} placeholder='Zipcode' name='zipcode' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' maxLength={6}/>
             <input type="text" placeholder='Country' value={formData.country ?? ''} name='country' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
            </div>

            <input type="number"  value={formData.phone ?? ''} placeholder='Phone'  name='phone' onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' maxLength={10}/>
             
      </div>


      {/**-----------Right side------------ */}

        <div className='mt-8'>
          <div className='mt-8 min-w-80'>
            <CartTotal />
          </div>

          <div className='mt-12'>
              <Title text1={'PAYMENT'} text2={'METHOD'}/>
              <div className='flex gap-3 flex-col lg:flex-row'>
                  <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer' onClick={()=> setSelected('stripe')}>
                      <span className={`min-w-3.5 h-3.5 border rounded-full ${selected === "stripe"? "bg-green-500" : ""}`}></span>
                      <Image src={stripeImge} alt='stripe-img'className='h-5 mx-4'/>
                  </div>
                  <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer' onClick={()=> setSelected('razor')}>
                      <span className={`min-w-3.5 h-3.5 border rounded-full ${selected === "razor" ? "bg-green-500" : ""}`}></span>
                      <Image src={razorimg} alt='razorpay-img'className='h-5 mx-4'/>
                  </div>
                  <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer'onClick={()=> setSelected('cod')}>
                      <span className={`min-w-3.5 h-3.5 border rounded-full ${selected === "cod"? "bg-green-500" : ""}`} ></span>
                      <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                  </div>
              </div>

                 <div className='w-full text-center md:text-end mt-8'>
                   <button type='submit' className='w-full md:w-56 bg-black text-white px-16 py-3 text-sm'>
                        PLACE ORDER
                   </button>
                 </div>

          </div>
        </div>

    </form>
  )
}

export default PlaceOrderpage