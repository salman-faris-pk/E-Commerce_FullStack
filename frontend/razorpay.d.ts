export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string | number | undefined;
  name?: string;
  description?: string;
  order_id: string;
  receipt?: string | number | undefined;
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

export {};