"use client"
import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

const Hero: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    if (!emblaApi) return

    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => clearInterval(autoplayInterval)
  }, [emblaApi])

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

      {/* Right side with responsive height */}
      <div className='w-full sm:w-1/2 overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          <div className="relative flex-[0_0_100%] min-w-0 h-80 sm:h-[28rem]"> {/* Mobile: h-80 (20rem), Desktop: h-[28rem] */}
            <Image 
              src="/a1.jpg" 
              alt="hero-img" 
              fill 
              quality={100} 
              priority={true}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative flex-[0_0_100%] min-w-0 h-80 sm:h-[28rem]">
            <Image 
              src="/a2.jpg" 
              alt="hero-img" 
              fill 
              quality={100} 
              priority={true}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative flex-[0_0_100%] min-w-0 h-80 sm:h-[28rem]">
            <Image 
              src="/a4.jpg" 
              alt="hero-img" 
              fill 
              quality={100} 
              priority={true}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative flex-[0_0_100%] min-w-0 h-80 sm:h-[28rem]">
            <Image 
              src="/a7.jpg" 
              alt="hero-img" 
              fill 
              quality={100} 
              priority={true}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative flex-[0_0_100%] min-w-0 h-80 sm:h-[28rem]">
            <Image 
              src="/a10.jpg" 
              alt="hero-img" 
              fill 
              quality={100} 
              priority={true}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero