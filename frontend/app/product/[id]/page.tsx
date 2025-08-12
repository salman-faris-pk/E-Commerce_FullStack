"use client";
import { backendUrl } from "../../../utils/backendUrl";
import { DescriptionReview } from "@/components/DescriptionReview";
import { RelatedProducts } from "@/components/RelatedProducts";
import { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { use } from 'react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import star from "@/public/star.png"
import halfstar from "@/public/halfStar.png"


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

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: productId } = use(params);
  const [image, setImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [size, setSize] = useState("");

  const TextSkeleton = ({ width = 'full' }: { width?: string }) => (
    <div className={`bg-gray-200 animate-pulse h-4 rounded my-1 w-${width}`}></div>
  );

  const ButtonSkeleton = () => (
    <div className="bg-gray-200 animate-pulse h-12 w-32 rounded"></div>
  );

  const queryClient = useQueryClient();
  const { token } = useSelector((state: RootState) => state.user);

  const { data: singleproduct, isLoading: isProductLoading } = useQuery<Product | undefined>({
    queryKey: ["singlepro", productId],
    queryFn: async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/product/single-product/${productId}`
        );
        if (response.data.success) return response.data.product;
        toast.error(response.data.message);
        return undefined;
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        return undefined;
      }
    },
  });

  const { mutate: addToCart } = useMutation({
    mutationFn: async ({ productId, size, price }: { 
      productId: string; 
      size: string; 
      price: number;
    }) => {
      try {
        const res = await axios.post(
          `${backendUrl}/api/user/add-to-cart`, 
          { productId, size, price },
          { headers: { token } }
        );        
        if (res.data.success) return res.data.cartData;
        toast.error(res.data.message);
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["totalcount"] });
      toast.success("Item added to cart");
    },
  });

  useEffect(() => {
    if (singleproduct && singleproduct?.image?.length > 0) {
      setImage(singleproduct.image[0]);
      setSelectedImage(singleproduct.image[0]);
    }
  }, [singleproduct]);


  return (
    <div className="border-t-2 pt-10">
      {isProductLoading ? (
        <div className="flex gap-12 flex-col sm:flex-row animate-pulse">
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col gap-3 sm:w-[18.7%] w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 w-full aspect-square"></div>
              ))}
            </div>
            <div className="w-full sm:w-[80%] bg-gray-200 aspect-[4/5]"></div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="bg-gray-200 h-8 w-64"></div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 w-4 h-4 rounded-full"></div>
              ))}
            </div>
            <div className="bg-gray-200 h-8 w-32"></div>
            <div className="space-y-2">
              <TextSkeleton width="3/4" />
              <TextSkeleton width="1/2" />
              <TextSkeleton width="2/3" />
            </div>
            <div className="space-y-2">
              <TextSkeleton width="1/4" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 w-12 h-10"></div>
                ))}
              </div>
            </div>
            <ButtonSkeleton />
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            {/* Image Gallery */}
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2">
                {singleproduct?.image.map((item, index) => (
                  <div 
                    key={index} 
                    className="relative w-[24%] sm:w-full sm:mb-3 flex-shrink-0 aspect-square"
                  >
                    <Image
                      src={item}
                      fill
                      className={`object-cover cursor-pointer ${
                        item === selectedImage ? "border-2 border-slate-200" : ""
                      }`}
                      onMouseEnter={() => setImage(item)}
                      onMouseLeave={() => setImage(selectedImage)}
                      onClick={() => setSelectedImage(item)}
                      alt={`Product thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="w-full sm:w-[80%] relative aspect-[4/5]">
                 {image && (
                  <Image
                    src={image}
                    fill
                    className="object-cover" 
                    alt="Main product image"
                  />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="font-medium text-2xl mt-2">{singleproduct?.name}</h1>
              
              <div className="flex items-center gap-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <Image key={i} src={star} alt="rthgtr" className="w-3.5" />
                ))}
                <Image src={halfstar} alt="fgbng" className="w-3.5" />
                <p className="pl-2">(122)</p>
              </div>

              <p className="mt-5 text-3xl font-medium">₹{singleproduct?.price}</p>
              <p className="mt-5 text-gray-500 md:w-4/5">
                {singleproduct?.description}
              </p>
              
              <div className="flex flex-col gap-4 my-8">
                <p>Select Size</p>
                <div className="flex gap-2 flex-wrap">
                  {singleproduct?.sizes.map((item, index) => (
                    <button
                      key={index}
                      className={`border py-2 px-4 bg-gray-100 ${
                        item === size ? "border-2 border-orange-500" : ""
                      }`}
                      onClick={() => setSize(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {token ? (
                <button
                  className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
                  onClick={() => singleproduct && addToCart({
                    productId: singleproduct._id,
                    size,
                    price: singleproduct.price,
                  })}
                >
                  ADD TO CART
                </button>
              ) : (
                <button
                  className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
                  onClick={() => toast.warning("Please login")}
                >
                  ADD TO CART
                </button>
              )}

              <hr className="mt-8 sm:w-4/5" />
              <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
              </div>
            </div>
          </div>

          {singleproduct && (
            <>
              <DescriptionReview productId={singleproduct._id} />
              <RelatedProducts
                _id={singleproduct._id}
                category={singleproduct.category}
                subCategory={singleproduct.subCategory}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;