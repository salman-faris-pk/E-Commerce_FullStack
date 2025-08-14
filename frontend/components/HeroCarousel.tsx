"use client";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image, { StaticImageData } from "next/image";

interface HeroCarouselProps {
  images: (string | StaticImageData)[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  useEffect(() => {
    if (!emblaApi) return;
    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
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
              priority={index === 0}
              quality={index === 0 ? 100 : 80}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
