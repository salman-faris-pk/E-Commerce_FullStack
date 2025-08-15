import CollectionPageClient  from "./CollectionPageClient";
import { backendUrl } from "@/utils/backendUrl";


export default async function CollectionPage() {
  let products = [];

  try {
    const res = await fetch(`${backendUrl}/api/product/all-collections`, {
      next: { revalidate: 60}
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