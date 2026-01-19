import React from 'react'
import Image from 'next/image'
import exchange from "@/public/exchange.png"
import returnIcon from "@/public/return.png"
import supportIcon from "@/public/support.png"


 const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs  sm:text-sm md:text-base text-gray-700'>
        
        <div>
            <Image src={exchange} alt='exchange-icon' className='w-12 m-auto mb-5'/>
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>We offer hassle free exchange policy</p>
        </div>

        <div>
            <Image src={returnIcon} alt='exchange-icon' className='w-12 m-auto mb-5'/>
            <p className='font-semibold'>7 Days Return Policy</p>
            <p className='text-gray-400'>We provide 7 days free return policy</p>
        </div>

        <div>
            <Image src={supportIcon} alt='exchange-icon' className='w-12 m-auto mb-5'/>
            <p className='font-semibold'>Best customer support</p>
            <p className='text-gray-400'>we provide 24/7 customer support</p>
        </div>
    </div>
  )
}

export default OurPolicy;