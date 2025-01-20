


export interface AllProducts{
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string[];
    category: string;
    subCategory: string;
    sizes: string[];
    bestseller?: boolean;
};


export type productItemProp={
    _id:string;
    image: string;
    name: string;
    price: number
};

export interface AllFormData{
    firstName:string
    lastName:string
    email:string
    street:string
    city:string
    state:string
    zipcode:number | null
    country:string
    phone:number | null
};


export interface Order {
    amount: number;
    currency: string | number;
    id: string;
    receipt: string | number;
  };
  
  export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };


  export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    size: string;
    status: string;
    payment: boolean;
    paymentMethod: string;
    date: string;
    image: string[];
  };

  export interface OrdersResponse {
    success: boolean;
    message?: string;
    orders: {
      items: OrderItem[];
      status: string;
      payment: boolean;
      paymentMethod: string;
      date: string;
    }[];
  };

  export interface Cooment {
    username: string;
    comment: string;
  };