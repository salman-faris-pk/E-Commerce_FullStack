"use client"
import React from 'react'

export const Newsletter = () => {

    const handleSubmit =(e: React.FormEvent)=>{
       e.preventDefault();
    }

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>Join our newsletter for exclusive updates and special offers!</p>

        <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' onSubmit={handleSubmit}>
            <input type='email'
             placeholder='Enter your email'
             className='w-full sm:flex-1 outline-none'
             required 
            />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>
                SUBSCRIBE
            </button>
        </form>
    </div>
  )
}
