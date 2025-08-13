"use client";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import a1 from "@/public/assets/a1_n14v9i.webp"


const images = [
   a1,
   "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755061722/a2_yxcrsb.webp",
   'https://res.cloudinary.com/dqqcpkeup/image/upload/v1755061071/aa_m86dob.webp', 
   "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755062083/a7_bb22kb.webp",
   "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755061884/a4_egi2am.webp", 
   "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755062250/a10_c28kao.webp",
   "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755062811/cc_phk3wp.webp"
  ];


export const HeroCarousel= () => {

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;

    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoplayInterval);
  }, [emblaApi]);

  return (
    <div className="w-full sm:w-1/2 overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative flex-[0_0_100%] min-w-0 h-80 sm:h-[28rem]"
          >
            <Image
              src={src}
              alt={`hero-img-${index}`}
              fill
              loading="eager"
              quality={100}
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
