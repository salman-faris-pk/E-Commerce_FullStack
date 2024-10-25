import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { backendUrl } from '../App';
import axios from "axios"
import { toast } from 'react-toastify';





const Login = ({setToken}) => {


const [email,setEmail]=useState('')
const[password,setPassword]=useState('')

const canvasRef = useRef(null);
const Email = 'arsenal@gmail.com';
const Password = 'invincibles2003';
const Data = `email: ${Email}\npassword: ${Password}`; 


  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, Data, { width: 200 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [Data]);


  const handleSubmit=async(e)=>{
    try {
       e.preventDefault()

       const response= await axios.post(backendUrl+'/api/admin/login',{email,password})
       if(response.data.success){
         setToken(response.data.token)
       }else{
        toast.error(response.data.message)
       }
       
       
    } catch (error) {
        console.log(error);
        toast.error(error.message)
        
    }
  }

  return (
    <>
    
        <h1 className='flex items-center justify-center tracking-wide text-2xl font-bold absolute top-20 left-16 md:left-80'>
        Welcome! Please sign in to access the Admin Panel ...
        </h1>
     
     <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='flex flex-col md:flex-row bg-white shadow-md rounded-lg max-w-2xl w-full'>
          
        {/* QR Code Section */}
        <div className='flex items-center justify-center w-full md:w-1/2 p-6'>
          <div className='flex items-center justify-center md:block'>
            <h3 className='text-md text-gray-500 font-medium mb-2'>Scan the QR Code for Email and Password</h3>
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Login Form Section */}
        <div className='flex items-center justify-center w-full md:w-1/2 p-6'>
          <form className='w-full' onSubmit={handleSubmit}>
            <div className='mb-3'>
              <p>Email Address</p>
              <input
                type='email'
                placeholder='your@email.com'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
                className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              />
            </div>
            <div className='mb-3'>
              <p>Password</p>
              <input
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required
                className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              />
            </div>
            <button
              type='submit'
              className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black'
            >
              Login
            </button>
          </form>
        </div>
      </div>
      </div>

    </>

  )
}

export default Login