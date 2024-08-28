import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import localStorageMiddleware from "../middleware/localstorageMiddleware";

import { CartReducer } from "./cartSlice";
import { OrderReducer } from "./orderSlice";
// import { PaymentReducer } from "./paymentSlice";
import { ProductReduces } from "./productSlice";
import { CategoryReduces } from "./categorySlice";

const store = configureStore({
  reducer: {
    productSlice: ProductReduces,
    cartSlice: CartReducer,
    orderSlice: OrderReducer,
    categorySlice: CategoryReduces
    // paymentSlice: PaymentReducer,
  },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
