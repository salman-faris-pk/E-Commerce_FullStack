import Link from 'next/link';
import { productItemProp } from "../app/types/AllTypes"
import Image from 'next/image';


export const ProductItem = ({_id,image,name,price}:productItemProp) => {
    const currency="₹";

  return (
    <Link href={`/product/${_id}`} className='text-gray-700 cursor-pointer'>
      <div className='overflow-hidden'>
        <Image src={image} alt='imges' width={195} height={224} quality={80} loading='lazy' className='hover:scale-110 transition ease-in-out'/>
      </div>
       <p className='pt-3 pb-1 text-sm'>{name}</p>
       <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>

  )
}
