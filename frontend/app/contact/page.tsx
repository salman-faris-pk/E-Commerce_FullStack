import { Newsletter } from '@/components/Newsletter'
import Title from '@/components/Title'
import React from 'react'

const Contactpage = () => {
  return (
    <div>
        
        <div className='text-center text-2xl pt-10 border-t'>
            <Title text1={'CONTACT'} text2={'US'}/>
        </div>

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
            <img src='/contactImg.png' alt='conatct-img'
             className='w-full md:max-w-[480px]'
            />
            <div className='flex flex-col justify-center items-start gap-6'>
                <p className='font-semibold text-xl text-gray-600'>Our Store</p>
                <p className='text-gray-500'>676303 Kinfra Tech Industrial
                    <br/>
                    Suite 501, Calicut, Kerala
                </p>
                <p className='text-gray-500'>Tel: (415) 555-0132 <br/> Email: admin@AGACI.com</p>
                <p className='font-semibold text-xl text-gray-600'>Careers at A'GACI</p>
                <p className='text-gray-500'>Learn more about our teams and job openings.</p>
                <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
                    Explore Jobs
                </button>
            </div>
        </div>

          <Newsletter />

    </div>
  )
}

export default Contactpage