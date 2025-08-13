"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { backendUrl } from "../../utils/backendUrl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import paymentImg from "@/public/payment.png";

const Page = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only read search params on client
  const success = isClient ? new URLSearchParams(window.location.search).get("success") : null;
  const orderId = isClient ? new URLSearchParams(window.location.search).get("orderId") : null;

  const verifyPayment = useCallback(async () => {
    try {
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await axios.post(
        `${backendUrl}/api/order/verifystripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (res.data.success) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        router.replace("/orders");
      } else {
        router.replace("/cart");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }, [token, success, orderId, router, queryClient]);

  
  useEffect(() => {
    if (isClient) {
      verifyPayment();
    }
  }, [isClient, verifyPayment]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center">
        <Image src={paymentImg} alt="success" className="w-52 h-32" />
      </div>
    </Suspense>
  );
};

export default Page;
