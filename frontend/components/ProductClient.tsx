"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { RootState } from "@/store/store";
import { backendUrl } from "@/utils/backendUrl";
import { DescriptionReview } from "@/components/DescriptionReview";
import { RelatedProducts } from "@/components/RelatedProducts";

import star from "@/public/star.png";
import halfstar from "@/public/halfStar.png";

type Product = {
  _id: string;
  category: string;
  description: string;
  image: string[];
  name: string;
  price: number;
  sizes: string[];
  subCategory: string;
};

export default function ProductClient({ product }: { product: Product }) {
  const [image, setImage] = useState(product.image[0]);
  const [selectedImage, setSelectedImage] = useState(product.image[0]);
  const [size, setSize] = useState("");

  const { token } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    product.image.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, [product.image]);

  /* Add to cart */
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        toast.warning("Please login to add items to cart");
        return;
      }

      const res = await axios.post(
        `${backendUrl}/api/user/add-to-cart`,
        {
          productId: product._id,
          size,
          price: product.price,
        },
        {
          headers: { token },
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["totalcount"] });
      toast.success("Product added to cart");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="border-t-2 pt-10">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* IMAGE GALLERY */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col gap-2 sm:w-[18.7%] w-full">
            {product.image.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square w-[24%] sm:w-full"
              >
                <Image
                  src={img}
                  fill
                  alt={`Thumbnail ${index + 1}`}
                  className={`object-cover rounded cursor-pointer ${
                    selectedImage === img
                      ? "border-2 border-gray-400"
                      : ""
                  }`}
                  onMouseEnter={() => setImage(img)}
                  onMouseLeave={() => setImage(selectedImage)}
                  onClick={() => setSelectedImage(img)}
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full sm:w-[80%] aspect-[4/5]">
            <Image
              src={image}
              fill
              alt="Product image"
              className="object-cover rounded"
              priority
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <Image key={i} src={star} alt="star" className="w-3.5" />
            ))}
            <Image src={halfstar} alt="half star" className="w-3.5" />
            <p className="pl-2 text-sm text-gray-500">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">₹{product.price}</p>

          <p className="mt-5 text-gray-500 md:w-4/5 line-clamp-4">
            {product.description}
          </p>

          {/* SIZE */}
          <div className="my-8">
            <p className="font-medium mb-3">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setSize(prev => (prev === item ? "" : item))
                  }
                  className={`px-4 py-2 border transition-all ${
                    size === item
                      ? "border-orange-500 bg-orange-50"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            disabled={!size || addToCartMutation.isPending}
            onClick={() => addToCartMutation.mutate()}
            className="bg-black text-white px-8 py-3 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {addToCartMutation.isPending ? "ADDING..." : "ADD TO CART"}
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 space-y-1">
            <p>100% Original product.</p>
            <p>Cash on delivery available.</p>
            <p>Easy returns within 7 days.</p>
          </div>
        </div>
      </div>

      {/* EXTRA SECTIONS */}
      <DescriptionReview productId={product._id} />

      <RelatedProducts
        _id={product._id}
        category={product.category}
        subCategory={product.subCategory}
      />
    </div>
  );
}

