import CollectionPageClient  from "./CollectionPageClient";
import { backendUrl } from "@/utils/backendUrl";


export default async function CollectionPage() {
  let products = [];

  try {
    const res = await fetch(`${backendUrl}/api/product/all-collections`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
    }
  } catch {
    products = [];
  }

  return <CollectionPageClient initialProducts={products} />;
}