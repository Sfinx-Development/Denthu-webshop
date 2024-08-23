import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../slices/store";

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  const state: RootState = store.getState();

  if (state.productSlice.products) {
    localStorage.setItem(
      "products",
      JSON.stringify(state.productSlice.products)
    );
  }
  if (state.productSlice.activeProduct) {
    localStorage.setItem(
      "activeProduct",
      JSON.stringify(state.productSlice.activeProduct)
    );
  }
  // else {
  //   localStorage.removeItem("products");
  // }

  return result;
};

export default localStorageMiddleware;
