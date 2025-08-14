import Title from '@/components/Title';
import { ProductItem } from '@/components/ProductItem';
import { backendUrl } from '@/utils/backendUrl';
import { productItemProp } from '@/app/types/AllTypes';

const fetchLatestProducts = async () => {
  try {
    const res = await fetch(`${backendUrl}/api/product/latest-products`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch latest products');
    }

    return data.success ? data.lastTenProduct : [];
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
};

const LatestCollections = async () => {
  const latestData: productItemProp[] = await fetchLatestProducts();

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1='LATEST' text2='COLLECTIONS' />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Explore our latest collection of must-have dresses, curated to elevate your style and comfort.
        </p>
      </div>
      
      {latestData.length === 0 ? (
        <p className='text-center text-gray-500'>No latest collections available.</p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {latestData.map((item) => (
            <ProductItem
              key={item._id}
              _id={item._id}
              image={item.image[0]}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollections;
