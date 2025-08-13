import { backendUrl } from "../utils/backendUrl";
import { RootState } from "@/store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Cooment } from "../app/types/AllTypes"
import { Send } from "lucide-react";



export const DescriptionReview = ({productId}:{productId:string}) => { 
    
  const [activeTab, setActiveTab] = useState("description");
  const [message,setMessage]=useState<string>('')
  const queryClient = useQueryClient();
  const { token }=useSelector((state: RootState) => state.user);

 
  const handleSendComment=async()=>{
    try {
      const response=await axios.post(backendUrl+"/api/product/postcomment",{
        productId,
        comment:message
      },{
        headers:{token}
      })
       
      if(response.data.success){
        setMessage('')
        queryClient.invalidateQueries({ queryKey: ["comments"] });
        return response.data
      }else{
        toast.error(response.data.message)
      }
      
    } catch (error:unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        } else {
        toast.error("An unknown error occurred");
       }
    }
  }



   const {data: allComents}=useQuery<Cooment[],Error>({
    queryKey:["comments",productId],
    queryFn:async()=>{
      try {
        const response = await axios.get(`${backendUrl}/api/product/comments?productId=${productId}`);
        if(response.data.success){
          return response.data.comments;
        }else{
          toast.error(response.data.message)
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          } else {
          toast.error("An unknown error occurred");
         }
        
      }
    },
       enabled: !!productId,
   })
  
   const comments = allComents ? [...allComents].reverse() : [];
   const comentlength= comments.length;

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
          Reviews ({comentlength})
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
              variations (e.g., sizes). Each product usually has its own
              dedicated page with relevant information.
            </p>
          </>
        )}

        {activeTab === "reviews" && (
             <div className="flex flex-col"> 
             {token && (
              <div className="flex px-3 gap-x-3">
                <input type="text"
                 className="outline-none border-b text-sm  w-full sm:w-[50%] px-3 py-1"
                 placeholder="type review...."
                 value={message}
                 onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setMessage(e.target.value)}
                 />
                 <button className="p-2 bg-gray-200 text-black/80 rounded-md" type="button"  onClick={handleSendComment}>
                 <Send size={15}/>
                </button>
               </div>
                )}
            
            <div className="max-h-60 overflow-y-auto ">
             {comments&&comments.map((coments,index)=>(
               <div className="space-y-3 p-3 rounded-md" key={index}>
               <div className="border p-4 rounded-md mt-1">
                 <h3 className="font-semibold text-md">{coments.username}</h3>
                 <p className="text-xs md:mt-2">{coments.comment}</p> 
              </div>
             </div>
             ))}

             </div>
               


         </div>
        )}
      </div>
    </div>
  );
};
