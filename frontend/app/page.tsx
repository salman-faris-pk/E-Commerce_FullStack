import { BestSeller } from "@/components/BestSeller";
import Hero from "@/components/Hero";
import LatestCollections from "@/components/LatestCollections";
import { Newsletter } from "@/components/Newsletter";
import { OurPolicy } from "@/components/OurPolicy";

export const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL


export default function Home() {
  return (
   <div>

      <Hero />
      <LatestCollections />
      <BestSeller />
      <OurPolicy />
      <Newsletter />
   
   </div>
  );
}


