import React from 'react'
import { IoAddCircleOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom"
import { LiaListSolid } from "react-icons/lia";
import { MdOutlinePendingActions } from "react-icons/md";
import { TbLayoutDashboard } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";




const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
       <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

          <NavLink to="/" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded">
              <TbLayoutDashboard className="text-gray-600" size={24}/>
              <p className='hidden md:block'>Dashboard</p>
           </NavLink>

           <NavLink to="/add-product" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded">
              <IoAddCircleOutline className="text-gray-600" size={24}/>
              <p className='hidden md:block'>Add items</p>
           </NavLink>

           <NavLink to="/list-product" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded">
              <LiaListSolid className="text-gray-600" size={24}/>
              <p className='hidden md:block'>List items</p>
           </NavLink>


           <NavLink to="/order-details" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded">
              <MdOutlinePendingActions className="text-gray-600" size={24}/>
              <p className='hidden md:block'>Orders</p>
           </NavLink>
           <NavLink to="/users" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded">
              <FaUsers className="text-gray-600" size={24}/>
              <p className='hidden md:block'>Users</p>
           </NavLink>

       </div>
    </div>
  )
}

export default Sidebar