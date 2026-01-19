import Title from '@/components/Title';
import { ProductItem } from '@/components/ProductItem';
import { backendUrl } from '@/utils/backendUrl';
import { productItemProp } from '@/app/types/AllTypes';

const fetchBestSellers = async () => {
  try {
    const res = await fetch(`${backendUrl}/api/product/best-sellers`, {
      next: { revalidate: 60 }, 
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch best sellers');
    }

    return data.success ? data.bestSells : [];
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
};

const BestSeller = async () => {
  const bestSeller: productItemProp[] = await fetchBestSellers();

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1='BEST' text2='SELLERS' />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Our top-selling products, chosen for their exceptional quality and popularity, perfect for enhancing your lifestyle.
        </p>
      </div>
      
      {bestSeller.length === 0 ? (
        <p className='text-center text-gray-500'>No best sellers available.</p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {bestSeller.map((item) => (
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

export default BestSeller;
