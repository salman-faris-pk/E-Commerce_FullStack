import BestSeller from "@/components/BestSeller";
import Hero from "@/components/Hero";
import LatestCollections from "@/components/LatestCollections";
import  Newsletter  from "@/components/Newsletter";
import  OurPolicy  from "@/components/OurPolicy";



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


