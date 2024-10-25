"use client";

import Title from "@/components/Title";
import { useEffect} from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {  setCategory, setSortType, setSubCategory, toggleShowFilter } from "@/features/ProductSlice";
import { CollectionItem } from "@/components/CollectionItem";
import { backendUrl } from "../page";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";






const collectionPage = () => {


    const dispatch = useDispatch();
    const showFilter = useSelector((state: RootState) => state.products.showFilter);
    const category = useSelector((state: RootState) => state.products.category);
    const subcategory = useSelector((state: RootState) => state.products.subcategory);
    const sortType = useSelector((state: RootState) => state.products.sortType);
    const search = useSelector((state: RootState) => state.products.search);

   
    
   useEffect(() => {
    const savedCategory = localStorage.getItem("category");
    const savedSubCategory = localStorage.getItem("subcategory");
    const savedSortType = localStorage.getItem("sortType");

    if (savedCategory) {
        dispatch(setCategory(savedCategory.split(',')));
    }
    if (savedSubCategory) {
        dispatch(setSubCategory(savedSubCategory.split(',')));
    }
    if (savedSortType) {
        dispatch(setSortType(savedSortType));
    }
}, [dispatch]);


useEffect(() => {
    localStorage.setItem("category", category.join(','));
    localStorage.setItem("subcategory", subcategory.join(','));
    localStorage.setItem("sortType", sortType);
}, [category, subcategory, sortType]);
  

  useEffect(() => {
    if (category.length || subcategory.length || sortType) {
      localStorage.setItem("category", category.join(','));
      localStorage.setItem("subcategory", subcategory.join(','));
      localStorage.setItem("sortType", sortType);
    }
  }, [category, subcategory, sortType]);
    

    

    const query = {
        search,
        category: Array.isArray(category) ? category.join(',') : category,
        subCategory: Array.isArray(subcategory) ? subcategory.join(',') : subcategory,
        sortType,
    };

  
    const { data: Allproducts,isLoading}=useQuery({
        queryKey:["allproducts",query],
        queryFn: async()=>{
            const res = await axios.get(`${backendUrl}/api/product/all-collections`, { params: query });
          if(res.data.success){
            return res.data.products
          }else{
            toast.error(res.data.message)
          }
        },
        refetchOnWindowFocus: true, 
        refetchOnReconnect: true, 
    })

    
    
    const handleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newCategories = category.includes(value)
            ? category.filter(item => item !== value)
            : [...category, value];
    
        dispatch(setCategory(newCategories));
    };
    
    const handleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newSubCategories = subcategory.includes(value)
            ? subcategory.filter(item => item !== value)
            : [...subcategory, value];
    
        dispatch(setSubCategory(newSubCategories));
    };
    

    
   

    if (isLoading) {
        return <div>Loading...</div>; 
    }


    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
           
           {/**filter options */}
            <div className="min-w-60">
                <p className="my-2 text-xl flex items-center cursor-pointer gap-2"
                 onClick={()=> dispatch(toggleShowFilter())}>
                    FILTERS <MdArrowForwardIos size={16} className={`text-gray-300 sm:hidden ${showFilter ? "rotate-90" : ""}`}/>
                </p>

                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? " " : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                      <p className="flex gap-2">
                         <input type="checkbox" value={'Men'} checked={category.includes('Men')}  className="w-3" onChange={handleCategory}/> Men
                      </p>
                      <p className="flex gap-2">
                         <input type="checkbox" value={'Women'} checked={category.includes('Women')}  className="w-3" onChange={handleCategory}/> Women
                      </p>
                      <p className="flex gap-2">
                         <input type="checkbox" value={'Kids'} className="w-3" checked={category.includes('Kids')}  onChange={handleCategory}/> Kids
                      </p>
                    </div>
                </div>

                    
               
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? " " : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                      <p className="flex gap-2">
                         <input type="checkbox" value={'Topwear'} checked={subcategory.includes('Topwear')}  className="w-3" onChange={handleSubCategory}/> Topwear
                      </p>
                      <p className="flex gap-2">
                         <input type="checkbox" value={'Bottomwear'} checked={subcategory.includes('Bottomwear')}  className="w-3" onChange={handleSubCategory}/> Bottomwear
                      </p>
                      <p className="flex gap-2">
                         <input type="checkbox" value={'Winterwear'} checked={subcategory.includes('Winterwear')}  className="w-3" onChange={handleSubCategory}/> Winterwear
                      </p>
                    </div>
                </div>

            </div>


            {/**rightside */}

            <div className="flex-1">

                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={'ALL'} text2={"COLLECTIONS"}/>

                    {/**Sort by price */}
                    <select className="border-2 border-gray-300 text-sm px-2" value={sortType} onChange={(e)=> dispatch(setSortType(e.target.value))}>
                        <option value="relavent">Sort by: Relavent</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                  
                  {/**All collections  */}

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                     {
                        Allproducts && Allproducts.map((item:any)=> (
                            <CollectionItem id={item._id} name={item.name} image={item.image[0]} price={item.price} key={item._id}/>
                        ))
                     }
                  </div>

            </div>

        </div>
    );
};

export default collectionPage; 





