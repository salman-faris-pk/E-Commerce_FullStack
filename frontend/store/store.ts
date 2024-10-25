import { configureStore } from "@reduxjs/toolkit";
import ProductReducer from "@/features/ProductSlice"
import userReducer from "@/features/userSlice"


const store= configureStore({
    reducer:{
      products: ProductReducer,
      user:userReducer
    }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;