import { backendUrl } from "@/utils/backendUrl";
import ProductClient from "@/components/ProductClient";

type Product = {
  _id: string;
  bestseller?: boolean;
  category: string;
  description: string;
  image: string[];
  name: string;
  price: number;
  sizes: string[];
  subCategory: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${backendUrl}/api/product/single-product/${id}`,
      {
      method: "POST",
      cache: "no-store",
     }
    );
    
    const data = await res.json();
    
    return data.success ? data.product : null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: PageProps) {
  
   const { id } = await params;

  const product = await getProduct(id);
  
  if (!product) {
    return (
      <div className="border-t-2 pt-10 text-center py-20">
        <p className="text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <ProductClient product={product} />
  );
}
