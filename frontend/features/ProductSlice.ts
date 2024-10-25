import { createSlice, PayloadAction } from '@reduxjs/toolkit';



type Product = {
  _id: string;
  bestseller: boolean;
  category: string;
  description: string;
  image: string[];
  name: string;
  price: number;
  sizes: string[];
  subCategory: string;
};


interface ProductState {
  allProducts: Product[]; 
  showFilter: boolean;
  category: string[];
  subcategory: string[];
  sortType: string;
  search: string;
  showSearch: boolean;
}

const initialState: ProductState = {
  allProducts: [],
  showFilter: false,
  category: [],
  subcategory: [],
  sortType: 'relavent', 
  search: '',
  showSearch: false
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAllProducts(state, action: PayloadAction<Product[]>) {
      state.allProducts = action.payload;
    },
    toggleShowFilter(state) {
      state.showFilter = !state.showFilter;
    },
    setCategory(state, action: PayloadAction<string[]>) {
      state.category = action.payload;
    },
    setSubCategory(state, action: PayloadAction<string[]>) {
      state.subcategory = action.payload;
    },
    setSortType(state, action: PayloadAction<string>) {
      state.sortType = action.payload;
    },
    setSearch(state, action: PayloadAction<string>){
      state.search = action.payload;
    },
    setShowSearch(state, action:PayloadAction<boolean>){
      state.showSearch = action.payload
    }
  },
});

export const {
  setAllProducts,
  toggleShowFilter,
  setCategory,
  setSubCategory,
  setSortType,
  setSearch,
  setShowSearch
} = productSlice.actions;

export default productSlice.reducer;
