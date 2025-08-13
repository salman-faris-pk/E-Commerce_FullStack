import { StaticImageData } from "next/image";
import { HeroCarousel } from "./HeroCarousel";
import a1 from "@/public/assets/a1_n14v9i.webp";

const Hero = () => {
  const images: (string | StaticImageData)[] = [
    a1,
    "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755061722/a2_yxcrsb.webp",
    "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755061071/aa_m86dob.webp",
    "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755062083/a7_bb22kb.webp",
    "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755061884/a4_egi2am.webp",
    "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755062250/a10_c28kao.webp",
    "https://res.cloudinary.com/dqqcpkeup/image/upload/v1755062811/cc_phk3wp.webp",
  ];

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 mt-3 sm:mt-1">
      {/* Text Section */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="font-prata text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <HeroCarousel images={images} />
    </div>
  );
};

export default Hero;
