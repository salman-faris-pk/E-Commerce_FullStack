"use client";

import { useCallback } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setCategory,
  setSubCategory,
  toggleShowFilter,
} from "@/features/ProductSlice";

export const FilterOptions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showFilter = useSelector(
    (state: RootState) => state.products.showFilter
  );
  const category = useSelector((state: RootState) => state.products.category);
  const subcategory = useSelector(
    (state: RootState) => state.products.subcategory
  );

  const handleCategory = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newCategories = category.includes(value)
        ? category.filter((item) => item !== value)
        : [...category, value];
      dispatch(setCategory(newCategories));
    },
    [category, dispatch]
  );

  const handleSubCategory = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newSubCategories = subcategory.includes(value)
        ? subcategory.filter((item) => item !== value)
        : [...subcategory, value];
      dispatch(setSubCategory(newSubCategories));
    },
    [subcategory, dispatch]
  );

  const toggleFilter = useCallback(() => {
    dispatch(toggleShowFilter());
  }, [dispatch]);

  return (
    <div className="w-full sm:w-[200px] flex-shrink-0 sticky top-[52px] sm:top-0 z-10 bg-white sm:h-fit">
      <p
        className="my-2 text-xl flex items-center cursor-pointer gap-2"
        onClick={toggleFilter}
      >
        FILTERS{" "}
        <MdArrowForwardIos
          size={16}
          className={`text-gray-300 sm:hidden ${showFilter ? "rotate-90" : ""}`}
        />
      </p>

      <div
        className={`
      grid grid-cols-2 gap-3 mb-3
      ${showFilter ? "block sm:grid-cols-1" : "hidden sm:block"}
    `}
      >
        {/* Categories */}
        <div className="border border-gray-300 pl-3 pr-2 py-2 sm:pl-5 sm:py-3">
          <p className="mb-2 text-xs sm:text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm font-light text-gray-700">
            {["Men", "Women", "Kids"].map((item) => (
              <label
                key={item}
                className="flex gap-1 sm:gap-2 items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={item}
                  checked={category.includes(item)}
                  className="w-3 h-3"
                  onChange={handleCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="border border-gray-300 pl-3 pr-2 py-2 sm:pl-5 sm:py-3">
          <p className="mb-2 text-xs sm:text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm font-light text-gray-700">
            {["Topwear", "Bottomwear", "Winterwear"].map((item) => (
              <label
                key={item}
                className="flex gap-1 sm:gap-2 items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={item}
                  checked={subcategory.includes(item)}
                  className="w-3 h-3"
                  onChange={handleSubCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
