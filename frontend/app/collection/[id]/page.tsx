"use client";
import { DescriptionReview } from "@/components/DescriptionReview";
import { RelatedProducts } from "@/components/RelatedProducts";
import {RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../../../utils/backendUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


type Product = {
  _id: string;
  bestseller?: boolean;
  category: string;
  description: string;
  image: string[];
  name: string;
  price: number;
  sizes: string[];
  subCategory: string;
};

const CollectionItemPage = ({ params }: { params: { id: string } }) => {
  const { id: productId } = params;

  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [size, SetSize] = useState("");

  

  const queryClient = useQueryClient();

 
  const {token}=useSelector((state: RootState) => state.user);

  const { data: singleproduct,isLoading } = useQuery<Product | undefined>({
    queryKey: ["singlepro", productId],
    queryFn: async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/product/single-product/${productId}`
        );

        if (response.data.success) {
          return response.data.product;
        } else {
          toast.error(response.data.message);
        }
      } catch (error:unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          } else {
          toast.error("An unknown error occurred");
         }
      }
    },
  });


  const { mutate: addToCart} = useMutation({
    mutationFn: async ({productId,size, price,}: {productId: string; size: string; price: number;}) => {
      try {
        const res = await axios.post(`${backendUrl}/api/user/add-to-cart`, { productId, size, price},{
          headers:{token}
        });        
        if (res.data.success) {
          toast.success("Item added to cart");
          return res.data.cartData;
        } else {
          toast.error(res.data.message);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          } else {
          toast.error("An unknown error occurred");
         }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["totalcount"] });
      
    },
    onError: (error:unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
        } else {
        toast.error("An unknown error occurred");
       }
    },
  });

  useEffect(() => {
    if (singleproduct && singleproduct.image.length > 0) {
      setImage(singleproduct.image[0]);
      setSelectedImage(singleproduct.image[0]);
    }
  }, [singleproduct]);


  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
    <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
    {isLoading && <p className="flex items-center justify-center">Loading the product ....</p>}

      <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
        <div className="flex sm:flex-col overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
          {singleproduct &&
            singleproduct.image.map((item, index) => (
              <img
                src={item}
                key={index}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${
                  item === selectedImage
                    ? "border-2 border-slate-200 transition-all ease-in duration-200"
                    : ""
                }`}
                onMouseEnter={() => setImage(item)}
                onMouseLeave={() => setImage(selectedImage)}
                onClick={() => setSelectedImage(item)}
              />
            ))}
        </div>
        <div className="w-full sm:w-[80%] relative">
          <img src={image} className="w-full h-auto" />
        </div>
      </div>

      {/**------product info----------- */}

      <div className="flex-1">
        <h1 className="font-medium text-2xl mt-2">{singleproduct?.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <img src="/star.png" alt="" className="w-3.5" />
          <img src="/star.png" alt="" className="w-3.5" />
          <img src="/star.png" alt="" className="w-3.5" />
          <img src="/star.png" alt="" className="w-3.5" />
          <img src="/halfStar.png" alt="" className="w-3.5" />
          <p className="pl-2">(122)</p>
        </div>

        <p className="mt-5 text-3xl font-medium">₹{singleproduct?.price}</p>
        <p className="mt-5 text-gray-500 md:w-4/5">
          {singleproduct?.description}
        </p>
        <div className="flex flex-col gap-4 my-8">
          <p className="">Select Size</p>
          <div className="flex gap-2">
            {singleproduct?.sizes.map((item, index) => (
              <button
                key={index}
                className={`border py-2 px-4 bg-gray-100 ${
                  item === size ? "border-2 border-orange-500" : ""
                }`}
                onClick={() => SetSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>


   { token ? (
        <button
          className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          onClick={() => {
            if (singleproduct) {
              addToCart({
                productId: singleproduct._id,
                size,
                price: singleproduct.price,
              });
            }
          }}
        >
          ADD TO CART
        </button>
      ): (
        <button
        className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
        onClick={()=> toast.warning("please login")}
        >
        ADD TO CART
      </button>
      )}

        <hr className="mt-8 sm:w-4/5 " />
        <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
          <p>100% Original product.</p>
          <p>Cash on delivery is available on this product.</p>
          <p>Easy return and exchange policy within 7 days.</p>
        </div>
      </div>
    </div>

    {singleproduct && (
      <>
        <DescriptionReview productId={singleproduct._id}/>
        <RelatedProducts
          _id={singleproduct._id}
          category={singleproduct.category}
          subCategory={singleproduct.subCategory}
        />
      </>
    )}
  </div>
  );
};

export default CollectionItemPage;



