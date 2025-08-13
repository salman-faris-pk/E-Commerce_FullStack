"use client";
import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/features/userSlice";
import { RootState } from "@/store/store";
import { AppDispatch } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "@/utils/backendUrl";
import { ShoppingCart, User } from "lucide-react";

export default function UserMenuWithCart() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== token) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch, token]);

  const handleLogout = useCallback(() => {
    router.push("/login");
    localStorage.clear();
    dispatch(setToken(""));
  }, [dispatch, router]);

   const { data: totalcount, isLoading: isCartLoading,isFetching: isCartFetching } = useQuery({
    queryKey: ["totalcount", token],
    queryFn: async () => {
      if (!token) return 0;
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/cartcount`,
          {},
          { headers: { Token: token } }
        );
        return response.data.success ? response.data.productCount : 0;
      } catch {
        return 0;
      }
    },
    staleTime: 15 * 60 * 1000 ,
    enabled: !!token,
  });

  const { data: userData, isLoading: isUserLoading,isFetching: isUserFetching} = useQuery({
    queryKey: ["user-data", token],
    queryFn: async () => {
      if (!token) return null;
      try {
        const response = await axios.get(`${backendUrl}/api/user/get-me`, {
          headers: { Token: token },
        });
        return response.data.success ? response.data.user : null;
      } catch {
        return null;
      }
    },
    staleTime: 15 * 60 * 1000 ,
    enabled: !!token,
  });


   const initials = useMemo(() => {
  if (!userData?.name) return "";
  return userData.name.slice(0, 2).toUpperCase();
}, [userData]);


  const userDropdown = useMemo(() => {
    if (!token) return null;
    
    return (
      <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2 z-50 shadow-sm opacity-95">
        <div className="flex flex-col py-3 gap-y-2 w-fit px-3 bg-white text-gray-500 rounded">
          <p className="cursor-pointer text-sm text-black hover:bg-gray-400 hover:text-white px-2 rounded-sm">
            Profile
          </p>
          <p
            className="cursor-pointer text-sm text-black hover:bg-gray-400 hover:text-white px-2 rounded-sm"
            onClick={() => router.push("/orders")}
          >
            Orders
          </p>
          <a
            href="https://e-commerce-admin-alpha-steel.vercel.app"
            target="_blank"
            className="hidden sm:block cursor-pointer text-sm text-black hover:bg-gray-400 hover:text-white px-2 rounded-sm"
          >
            Admin
          </a>
          <p
            className="cursor-pointer text-sm text-black hover:bg-gray-400 hover:text-white px-2 rounded-sm"
            onClick={handleLogout}
          >
            Logout
          </p>
        </div>
      </div>
    );
  }, [token, router, handleLogout]);


const isLoading = isUserLoading || isUserFetching || isCartLoading || isCartFetching;


  return (
    isLoading ? (
        <div className="flex items-center gap-7">
        <div className="group relative">
          <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
        </div>
           <div className="relative">
          <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>

    ): (
        <div className="flex items-center gap-7">
      <div className="group relative">
        <button
          onClick={() => !token && router.push("/login")}
          aria-label={token ? "User menu" : "Login"}
          className="focus:outline-none"
        >
          {token && userData?.name ? (
            <div className="w-7 h-7 rounded-full border border-orange-100 bg-pink-700/90 flex items-center justify-center text-xs text-white font-medium">
              {initials}
            </div>
          ) : (
            <User className="text-gray-700 hover:text-black transition-colors mt-1.5" size={24} />
          )}
        </button>
        {userDropdown}
      </div>

      {/* Cart */}
      <Link href="/cart" className="relative" aria-label="Cart">
        <ShoppingCart className="cursor-pointer text-gray-700" size={24} />
        {(totalcount ?? 0) > 0 && (
          <p className="absolute right-[-1px] bottom-[1px] w-3 h-3 text-center leading-3 bg-black text-white aspect-square rounded-full text-[7px]">
            {totalcount > 9 ? "9+" : totalcount}
          </p>
        )}
      </Link>
    </div>
    )
   
  );
}

