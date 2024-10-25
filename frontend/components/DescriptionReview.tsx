import React, { useState } from "react";
import { IoSend } from "react-icons/io5";

export const DescriptionReview = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-20">
      <div className="flex">
        <span
          className={`border px-5 py-3 text-sm cursor-pointer ${
            activeTab === "description" ? "bg-gray-200 text-black/80 font-semibold" : "" }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </span>
        <span
          className={`border px-5 py-3 text-sm cursor-pointer ${
            activeTab === "reviews" ? "bg-gray-200 text-black/80 font-semibold" : "" }`}
             onClick={() => setActiveTab("reviews")}
        >
          Reviews (122)
        </span>
      </div>

      <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
        {activeTab === "description" && (
          <>
            <p>
              An e-commerce website is an online platform that facilitates the
              buying and selling of products or services over the internet. It
              serves as a virtual marketplace where businesses and individuals
              can showcase their products, interact with customers, and conduct
              transactions without the need for a physical presence. E-commerce
              websites have gained immense popularity due to their convenience,
              accessibility, and the global reach they offer.
            </p>
            <p>
              E-commerce websites typically display products or services along
              with detailed descriptions, images, prices, and any available
              variations (e.g., sizes, colors). Each product usually has its own
              dedicated page with relevant information.
            </p>
          </>
        )}

        {activeTab === "reviews" && (
             <div className="flex flex-col"> 
              <div className="flex px-3 gap-x-3">
                <input type="text"
                 className="outline-none border-b text-sm  w-full sm:w-[50%] px-3 py-1"
                 placeholder="type review...."
                 />
                 <button className="p-2 bg-gray-200 text-black/80 rounded-md" type="submit">
                 <IoSend size={15}/>
                </button>
               </div>
               <div className="max-h-60 overflow-y-auto space-y-3 p-3 rounded-md">
             <div className="border p-4 rounded-md mt-1">
                 <h3 className="font-semibold">User Review 1</h3>
                 <p>This product is amazing! I really love it.</p>
             </div>
             <div className="border p-4 rounded-md">
                 <h3 className="font-semibold">User Review 2</h3>
                 <p>Great quality and fast shipping. Highly recommend!</p>
             </div>
             <div className="border p-4 rounded-md">
                 <h3 className="font-semibold">User Review 3</h3>
                 <p>Not what I expected, but still decent.</p>
             </div>
             <div className="border p-4 rounded-md">
                 <h3 className="font-semibold">User Review 4</h3>
                 <p>Excellent customer service!</p>
             </div>
             <div className="border p-4 rounded-md">
                 <h3 className="font-semibold">User Review 5</h3>
                 <p>Will definitely buy again!</p>
             </div>
         </div>
         </div>
        )}
      </div>
    </div>
  );
};
