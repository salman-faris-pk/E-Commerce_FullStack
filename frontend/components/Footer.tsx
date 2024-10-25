import React from 'react'

const Footer = () => {

    const year = new Date().getFullYear();

  return (
    <div>
      <div className='flex flex-col  sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
         <div>
            <img src='/logo.png' alt='logo' className='mb-5 w-32'/>
            <p className='w-full md:w-2/3  text-gray-600'>
            At A'GACI, we offer trendy, high-quality clothing for every occasion. From everyday wear to special events, our collection is designed to keep you stylish. Shop with ease, enjoy fast shipping, and rely on our excellent customer service for a seamless experience.
            </p>
         </div>

         <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
         </div>

          <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 8943084655</li>
                <li>salmanulfarispk2001@gmail.com</li>
            </ul>
          </div>
      </div>

      <div>
        <hr/>
        <p className='py-5 text-sm text-center'>Copyright {year}@ salmaulfaris.dev - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer