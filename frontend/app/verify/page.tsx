"use client";
import axios from 'axios';
import {  useRouter } from 'next/navigation';
import React, { useEffect, Suspense, useState } from 'react';
import { backendUrl } from '../../utils/backendUrl';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Page = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only use hooks that depend on browser environment if on the client side
  const success = isClient ? new URLSearchParams(window.location.search).get('success') : null;
  const orderId = isClient ? new URLSearchParams(window.location.search).get('orderId') : null;

  const verifyPayment = async () => {
    try {
      if (!token) {
        router.replace("/login");
        return null;
      }
      const res = await axios.post(backendUrl + "/api/order/verifystripe", { success, orderId }, {
        headers: { token }
      });
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
  }

  useEffect(() => {
    if (isClient) {
      verifyPayment();
    }
  }, [token, success, orderId, isClient]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='flex items-center justify-center'>
        <img src='/payment.png' alt='success' className='w-52 h-32' />
      </div>
    </Suspense>
  );
};

export default Page;
