"use client"
import { setSearch, setShowSearch } from '@/features/ProductSlice'
import { RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { usePathname } from 'next/navigation'


export const Searchbar = () => {

    const dispatch=useDispatch()
    const search= useSelector((state: RootState)=> state.products.search)
    const showSearch= useSelector((state:RootState)=> state.products.showSearch)
     const [visible,setVisible]=useState(false)
    const pathname=usePathname()


     useEffect(()=>{
         if(pathname.includes("collection")){
            setVisible(true)
         }else{
            setVisible(false)
         }
     },[pathname])

  return  showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
         <input type='text'
          placeholder='Search..'
          className='flex-1 outline-none bg-inherit text-sm'
          value={search}
          onChange={(e)=> dispatch(setSearch(e.target.value))}
         />

         <CiSearch size={22} className='text-black'/>

      </div>

      <IoMdClose className='inline cursor-pointer text-gray-500' size={20}
       onClick={()=> dispatch(setShowSearch(false))}
      />

    </div>

  ): null ;
}
