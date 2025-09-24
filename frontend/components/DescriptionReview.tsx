import { backendUrl } from "../utils/backendUrl";
import { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Cooment } from "../app/types/AllTypes"
import { Send } from "lucide-react";



export const DescriptionReview = ({productId}:{productId:string}) => { 
    
  const [activeTab, setActiveTab] = useState("description");
  const [message,setMessage]=useState<string>('')
  const queryClient = useQueryClient();
  const { token }=useSelector((state: RootState) => state.user);

  const postCommentMutation = useMutation({
    mutationFn: async (commentText: string) => {
      if (!token) {
        toast.warning("Please login to post comments");
        return;
      }

      const response = await axios.post(`${backendUrl}/api/product/postcomment`,{
          productId,
          comment: commentText
        },
        {
          headers: { token }
        }
      );
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to post comment");
      }
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
      toast.success("Comment posted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post comment");
    }
  });
 
   const handleSendComment = useCallback(() => {
    if (!message.trim()) {
      toast.warning("Please enter a comment");
      return;
    }
    
    if (message.length > 500) {
      toast.warning("Comment must be less than 500 characters");
      return;
    }

    postCommentMutation.mutate(message.trim());
  }, [message, postCommentMutation]);


  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  }, [handleSendComment]);


    const { data: allComments, isLoading: commentsLoading } = useQuery<Cooment[],Error>({
    queryKey: ["comments", productId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/product/comments?productId=${productId}`
        );
        
        if (response.data.success) {
          return response.data.comments;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch comments";
        toast.error(errorMessage);
        return [];
      }
    },
    enabled: !!productId && activeTab === "reviews",
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const comments = useMemo(() => {
    if (!allComments) return [];
    return [...allComments].reverse();
  }, [allComments]);

  const commentLength = comments.length;


  const descriptionContent = useMemo(() => (
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
  ), []);

  const reviewsContent = useMemo(() => (
    <div className="flex flex-col"> 
      {token && (
        <div className="flex px-3 gap-x-3 mb-4">
          <input 
            type="text"
            className="outline-none border-b text-sm w-full sm:w-[50%] px-3 py-2"
            placeholder="Type your review..."
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={postCommentMutation.isPending}
            maxLength={500}
          />
          <button 
            className="p-2 bg-gray-200 text-black/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            type="button" 
            onClick={handleSendComment}
            disabled={postCommentMutation.isPending || !message.trim()}
          >
            <Send size={15} />
          </button>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mb-2 px-3">
        {message.length}/500 characters
      </div>

      <div className="max-h-60 overflow-y-auto">
        {commentsLoading ? (
          <div className="space-y-3 p-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border p-4 rounded-md animate-pulse">
                <div className="bg-gray-200 h-4 w-32 mb-2 rounded"></div>
                <div className="bg-gray-200 h-3 w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
            <div className="space-y-3 p-3 rounded-md" key={index}>
              <div className="border p-4 rounded-md mt-1 hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-md">{comment.username}</h3>
                <p className="text-xs md:mt-2 whitespace-pre-wrap break-words">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  ), [token, message, comments, commentsLoading, postCommentMutation.isPending, handleSendComment, handleKeyDown]);

  return (
    <div className="mt-20">
      <div className="flex border-b">
        <button
          className={`px-5 py-3 text-sm cursor-pointer transition-colors duration-200 ${
            activeTab === "description" 
              ? "bg-gray-200 text-black/80 font-semibold border-b-2 border-black" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={`px-5 py-3 text-sm cursor-pointer transition-colors duration-200 ${
            activeTab === "reviews" 
              ? "bg-gray-200 text-black/80 font-semibold border-b-2 border-black" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({commentLength})
        </button>
      </div>

      <div className="border-x border-b px-6 py-6 text-sm text-gray-500 min-h-[200px]">
        {activeTab === "description" && descriptionContent}
        {activeTab === "reviews" && reviewsContent}
      </div>
    </div>
  );
};
