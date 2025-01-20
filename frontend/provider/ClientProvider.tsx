"use client";

import { Provider } from 'react-redux';
import  store from "@/store/store"

type ClientProviderProps = {
  children: React.ReactNode;
};


const ClientProvider = ({ children }: ClientProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ClientProvider;