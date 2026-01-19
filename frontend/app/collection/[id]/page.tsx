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

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${backendUrl}/api/product/single-product/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data?.product ?? null;
  } catch {
    return null;
  }
}

export default async function CollectionItemPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="border-t-2 pt-10 text-center py-20">
        <p className="text-xl">Product not found</p>
      </div>
    );
  }

  return <ProductClient product={product} />;
}
