"use client";

import Title from "@/components/Title";
import { useCallback, useDeferredValue, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setSortType } from "@/features/ProductSlice";
import { CollectionItem } from "@/components/CollectionItem";
import { backendUrl } from "../../utils/backendUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { AllProducts } from "../types/AllTypes";
import { FilterOptions } from "@/components/FilterOptions";

const CollectionPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sortType = useSelector((state: RootState) => state.products.sortType);
  const search = useSelector((state: RootState) => state.products.search);
  const category = useSelector((state: RootState) => state.products.category);
  const subcategory = useSelector(
    (state: RootState) => state.products.subcategory
  );

   const deferredSearch = useDeferredValue(search);

  const query = useMemo(
    () => ({
      search: deferredSearch,
      category: Array.isArray(category) ? category.join(",") : category,
      subCategory: Array.isArray(subcategory)
        ? subcategory.join(",")
        : subcategory,
      sortType,
    }),
    [search, category, subcategory, sortType]
  );

  const { data: Allproducts, isLoading } = useQuery<AllProducts[]>({
    queryKey: ["allproducts", query],
    queryFn: async () => {
      const res = await axios.get(`${backendUrl}/api/product/all-collections`, {
        params: query,
      });
      if (res.data.success) {
        return res.data.products;
      } else {
        toast.error(res.data.message);
        return [];
      }
    },
    placeholderData: (prevData) => prevData,
    refetchOnWindowFocus: false,
  });

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortType(e.target.value));
    },
    [dispatch]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <FilterOptions />

      {/* Product grid */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-base sm:text-2xl mb-4 py-2 sticky top-[.1px] z-10 bg-white sm:h-fit">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            className="border-2 border-gray-300 text-sm px-2"
            value={sortType}
            onChange={handleSortChange}
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 h-40 animate-pulse rounded"
              ></div>
            ))
          ) : Allproducts && Allproducts.length > 0 ? (
            Allproducts.map((item) => (
              <CollectionItem
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image[0]}
                price={item.price}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              There is no product available for your search/filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
