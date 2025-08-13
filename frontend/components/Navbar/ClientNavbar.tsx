"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import UserMenuWithCart from "@/components/Navbar/UserMenu";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { setShowSearch } from "@/features/ProductSlice";
import { CircleArrowLeft, Menu, Search } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "HOME" },
  { path: "/collection", label: "COLLECTION" },
  { path: "/about", label: "ABOUT" },
  { path: "/contact", label: "CONTACT" },
] as const;

export default function ClientNavbar() {
  const dispatch: AppDispatch = useDispatch();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = useCallback((path: string) => 
    pathname === path || 
    (path !== '/' && pathname.startsWith(path)), 
    [pathname]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleSearchClick = useCallback(() => {
    dispatch(setShowSearch(true));
  }, [dispatch]);

  const renderDesktopNavItems = useMemo(() => (
    NAV_ITEMS.map((item) => (
      <Link
        key={item.path}
        href={item.path}
        className="flex flex-col items-center gap-1 group"
        aria-current={isActive(item.path) ? "page" : undefined}
      >
        <span className={
          isActive(item.path) 
            ? "text-gray-900 font-medium" 
            : "text-gray-600 hover:text-gray-900 transition-colors"
        }>
          {item.label}
        </span>
        <div className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive(item.path) ? "opacity-100" : "opacity-0 group-hover:opacity-50"} transition-opacity`} />
      </Link>
    ))
  ), [isActive]);

  const renderMobileNavItems = useMemo(() => (
    NAV_ITEMS.map((item) => (
      <Link
        key={item.path}
        href={item.path}
        onClick={toggleMobileMenu}
        className={`block py-3 px-4 rounded-lg text-lg ${
          isActive(item.path) 
            ? "bg-black/80 text-white font-medium" 
            : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-current={isActive(item.path) ? "page" : undefined}
      >
        {item.label}
      </Link>
    ))
  ), [isActive, toggleMobileMenu]);

  return (
    <>
      {/* Desktop Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {renderDesktopNavItems}
      </ul>

      {/* Mobile Menu Trigger & Icons */}
      <div className="flex items-center gap-6">
        <Link 
          href="/collection"
          onClick={handleSearchClick}
          aria-label="Search"
          className="text-gray-700 hover:text-black transition-colors"
        >
          <Search size={24} />
        </Link>
        
        <UserMenuWithCart />
        
        <button 
          onClick={toggleMobileMenu}
          aria-label="Open menu"
          className="sm:hidden text-gray-700 hover:text-black transition-colors"
        >
          <Menu  size={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 sm:hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full">
          <button 
            onClick={toggleMobileMenu}
            className="flex items-center gap-2 mb-8 text-gray-600 hover:text-black"
            aria-label="Close menu"
          >
            <CircleArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <nav className="flex-1 space-y-2">
            {renderMobileNavItems}
            <a
              href="https://e-commerce-admin-alpha-steel.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={toggleMobileMenu}
              className="block py-3 px-4 rounded-lg text-lg text-gray-600 hover:bg-gray-100 uppercase"
            >
              Admin
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}