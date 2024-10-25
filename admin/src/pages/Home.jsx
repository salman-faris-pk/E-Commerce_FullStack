import React from 'react'

const Home = () => {
  return (
    <div>
       
       <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-3xl font-bold text-purple-900 sm:text-4xl">Trusted by eCommerce Businesses</h2>

    <p className="mt-4 text-purple-950 sm:text-xl">
    provides a user-friendly interface for managing orders, with easy options to add, delete, and view total orders. Quick-access features ensure efficient navigation and streamlined order management. Perfect for keeping track of store activity effortlessly.
    </p>
  </div>

  <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
    <div className="flex flex-col rounded-lg bg-[#CDC1FF] px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-purple-950">Total Sales</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">$4.8m</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-[#CDC1FF] px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-purple-950">Official Addons</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">24</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-[#CDC1FF] px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-purple-950">Total Addons</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">86</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-[#CDC1FF] px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-purple-950">Downloads</dt>

      <dd className="text-4xl font-extrabold text-purple-600 md:text-5xl">86k</dd>
    </div>
  </dl>
</div>





    </div>
  )
}

export default Home