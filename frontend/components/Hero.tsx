"use client"
import React from 'react'
import 'swiper/css';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';



const Hero: React.FC = () => {




  return (
    <div className='flex flex-col sm:flex-row border border-gray-400 mt-3 sm:mt-1'>

       <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                        <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                    </div>

                     <h1 className='font-prata text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                     <div className='flex items-center gap-2'>
                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                        <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                     </div>
                </div>
       </div>


         {/**right side */}
           
      <Swiper className='w-full sm:w-1/2'
      modules={[Autoplay]} 
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
    >
      <SwiperSlide>
      <img src="/a1.jpg" alt='hero-img'/> 
      </SwiperSlide>
      <SwiperSlide>
      <img src="/a2.jpg" alt='hero-img'/> 
      </SwiperSlide>
      <SwiperSlide>
      <img src="/a4.jpg" alt='hero-img'/>    
      </SwiperSlide>
      <SwiperSlide>
      <img src="/a7.jpg" alt='hero-img'/> 
      </SwiperSlide>
      <SwiperSlide>
      <img src="/a10.jpg" alt='hero-img'/>    
      </SwiperSlide>
    </Swiper>

       

    </div>
  )
}

export default Hero