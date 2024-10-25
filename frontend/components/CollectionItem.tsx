"use client"
import Link from 'next/link';
import React from 'react'

type productItem={
    id:string;
    image: string;
    name: string;
    price: number
}

export const CollectionItem = ({id,image,name,price}:productItem) => {
    const currency="₹";


  
  return (
    <Link href={`/collection/${id}`} className='text-gray-700 cursor-pointer'>
      <div className='overflow-hidden'>
        <img src={image} alt='' className='hover:scale-110 transition ease-in-out'/>
      </div>
       <p className='pt-3 pb-1 text-sm'>{name}</p>
       <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>

  )
}
