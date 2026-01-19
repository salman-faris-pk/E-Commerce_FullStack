import CollectionPageClient from "./CollectionPageClient";
import { backendUrl } from "@/utils/backendUrl";
import { productItemProp } from "@/app/types/AllTypes";

export default async function CollectionPage() {
  let products: productItemProp[] = [];

  try {
    const res = await fetch(`${backendUrl}/api/product/all-collections`, {
      next: { revalidate: 180 },
    });

    if (res.ok) {
      const data = await res.json();
      products = data.products ?? [];
    }
  } catch (error) {
    console.error(error);
  }

  return <CollectionPageClient initialProducts={products} />;
}

