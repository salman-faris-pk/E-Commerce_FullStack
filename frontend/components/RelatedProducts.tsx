import Title from './Title';
import { ProductItem } from './ProductItem';
import { usePathname } from 'next/navigation';
import { CollectionItem } from './CollectionItem';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import { toast } from 'react-toastify';




interface Product {
  _id: string;
  image: string[];
  name: string;
  price: number;
}

interface AllCategories {
  _id: string | undefined;
  category: string | undefined;
  subCategory: string | undefined;
}

export const RelatedProducts = ({_id,category,subCategory}: AllCategories) => {

 
  const pathname=usePathname()

  const { data: related=[],isLoading} = useQuery<Product[]>({
    queryKey: ["relatedpro",category,subCategory],
    queryFn: async () => {
        try {
            const res = await axios.post(backendUrl + "/api/product/related-products", {
              currentProductId: _id,
              category,
              subCategory
            });   

            if (res.data.success) {
                return res.data.relatedProducts;
            } else {
                toast.error(res.data.message);
                return [];
            }
        } catch (error:unknown) {
          if (error instanceof Error) {
            console.error("Error fetching related products:", error.message);
            } else {
            console.error("An unknown error occurred while fetching related products");
            }
          return [];
        }
    }
});


 if (isLoading) {
  return <div className="text-center">Loading related products...</div>;
}
 

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={'RELATED'} text2={'PRODUCTS'}/>
        </div>
        
        { pathname === `/product/${_id}` &&
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
           {related && related.map((item)=> (
              <ProductItem _id={item._id} image={item.image[0]} name={item.name} price={item.price} key={item._id}/>
           ))}
        </div>
         }

          
      { pathname === `/collection/${_id}` &&
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
           {related && related.map((item)=> (
              <CollectionItem id={item._id} image={item.image[0]} name={item.name} price={item.price} key={item._id}/>
           ))}
        </div>
         }



    </div>
  )
}
