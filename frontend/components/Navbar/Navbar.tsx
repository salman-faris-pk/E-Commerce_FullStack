import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import ClientNavbar from "@/components/Navbar/ClientNavbar";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between py-6 font-medium">
      
      <Link href="/">
        <Image 
          src={logo} 
          className="w-28 sm:w-36" 
          alt="Logo" 
          width={144}
          height={80}
          priority
          quality={100}
        />
      </Link>
      
      {/** nav items */}
      <ClientNavbar />
    </div>
  );
}