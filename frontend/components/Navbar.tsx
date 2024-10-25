"use client"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setShowSearch } from '@/features/ProductSlice';
import { RootState } from '@/store/store';
import { AppDispatch } from "@/store/store"
import { setToken } from '@/features/userSlice';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { backendUrl } from '@/app/page';





export const Navbar = () => {
 

  const dispatch: AppDispatch = useDispatch();
  const pathname = usePathname();

  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!token && storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch, token]); 

   
  const isActive = (path: string) => pathname === path;

  const [visible,setVisible]=useState(false)
 
  const router=useRouter()
 
  const Logout = () => {
        router.push("/login");
        localStorage.clear();
        dispatch(setToken('')); 
    };
  
   const {data: totalcount}=useQuery({
    queryKey:["totalcount"],
    queryFn:async()=>{
      try {   
         const Token=localStorage.getItem("token")
        const response = await axios.post(
          backendUrl + "/api/user/cartcount",
          {}, 
          {
            headers: {
              Token
            },
          }
        );    
        
        if(Token && response.data.success){
          return response.data.productCount;
        }else{
          return 0; 
        }
        
      } catch (error:any) {
        return 0;
      }
    },
    refetchInterval: 2000,
   })

  

  return (
    <div className='flex items-center justify-between py-6 font-medium'>
      <Link href="/">
      <img src='/logo.png' className='w-28 sm:w-36' alt='Logo' />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <Link href="/" className='flex flex-col items-center gap-1'>
          <span className={isActive('/') ? 'text-gray-900' : ''}>HOME</span>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/') ? 'block' : 'hidden'}`} />
        </Link>

        <Link href="/collection" className='flex flex-col items-center gap-1'>
          <span className={isActive('/collection') ? 'text-gray-900' : ''}>COLLECTION</span>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/collection') ? 'block' : 'hidden'}`} />
        </Link>

        <Link href="/about" className='flex flex-col items-center gap-1'>
          <span className={isActive('/about') ? 'text-gray-900' : ''}>ABOUT</span>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/about') ? 'block' : 'hidden'}`} />
        </Link>

        <Link href="/contact" className='flex flex-col items-center gap-1'>
          <span className={isActive('/contact') ? 'text-gray-900' : ''}>CONTACT</span>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/contact') ? 'block' : 'hidden'}`} />
        </Link>
      </ul>


      <div className='flex items-center gap-6'>
         <span>
         <FiSearch  className='cursor-pointer text-gray-700'size={24} 
            onClick={()=> { 
              router.push("/collection")
              dispatch(setShowSearch(true))
              }}/>
         </span>


          <div className='group relative'>
            <span onClick={()=> token ? null : router.push("/login")}>
            <FaRegUser className='cursor-pointer text-gray-700' size={20}/>
          </span> 
          {token && 
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50 shadow-sm opacity-95'>
              <div className='flex flex-col py-1 w-fit px-1 bg-white text-gray-500 rounded'>
                    <p className='cursor-pointer text-sm text-black hover:bg-gray-400 hover:text-white px-2 rounded-sm'>Profile</p>
                    <p className='cursor-pointer text-sm text-black hover:bg-gray-400 hover:text-white px-2 rounded-sm'onClick={()=>router.push("/orders")}>Orders</p>
                    <p className='cursor-pointer text-sm text-black hover:bg-gray-400 hover:text-white px-2 rounded-sm' onClick={Logout}>Logout</p>
              </div>
          </div>
           }
       </div>
       

          <Link href='/cart' className='relative'>
             <span>
             <IoCartOutline className='cursor-pointer text-gray-700' size={24}/>
              <p className='absolute right-[-1px] bottom-[1px] w-3 h-3 text-center leading-3 bg-black text-white aspect-square rounded-full text-[7px]'>{totalcount}</p>
             </span>
          </Link>

           <span onClick={()=> setVisible(true)}>
                <HiOutlineMenuAlt3 className='cursor-pointer sm:hidden text-gray-700' size={22}/>
           </span>
      </div>

     
          {/**sidebar for mob screen */}
            <div className={`absolute top-0 right-0 bottom-0 h-full overflow-hidden bg-white z-50 transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600 '>
                    <div className='flex items-center gap-4 p-3 cursor-pointer' onClick={()=> setVisible(false)}>
                        <IoIosArrowBack className='text-gray-400' size={20}/>
                        <p>Back</p>
                    </div>

                    <Link href='/' onClick={()=> setVisible(false)} className={`py-2 pl-6 border ${isActive('/') ? "bg-black text-white" : ""}`}>HOME</Link>
                    <Link href='/collection' onClick={()=> setVisible(false)} className={`py-2 pl-6 border ${isActive('/collection') ? "bg-black text-white" : ""}`}>COLLECTION</Link>
                    <Link href='/about' onClick={()=> setVisible(false)} className={`py-2 pl-6 border ${isActive('/about') ? "bg-black text-white" : ""}`}>ABOUT</Link>
                    <Link href='/contact' onClick={()=> setVisible(false)} className={`py-2 pl-6 border ${isActive('/contact') ? "bg-black text-white" : ""}`}>CONTACT</Link>

                </div>
            </div>


    </div>
  );
};
