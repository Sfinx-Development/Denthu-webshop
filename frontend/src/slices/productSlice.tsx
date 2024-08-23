/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addProductToDB,
  editProductInDB,
  getProductFromDB,
  getProductsFromDB,
} from "../api/product";

export interface Size {
  label: string;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  in_store: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
  color: string;
  sizes: Size[];
  material: string;
  rabatt: number;
  launch_date: string;
  imageUrl: string;
}

const storedProducts = localStorage.getItem("products");
const storedActiveProduct = localStorage.getItem("activeProduct");

interface ProductState {
  products: Product[];
  activeProduct: Product | undefined;
  error: string | null;
}

export const initialState: ProductState = {
  products: storedProducts ? JSON.parse(storedProducts) : [],
  activeProduct: storedActiveProduct
    ? JSON.parse(storedActiveProduct)
    : undefined,
  error: null,
};

export const addProductAsync = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("products/addProduct", async (product, thunkAPI) => {
  try {
    const createdProduct = await addProductToDB(product);
    if (createdProduct) {
      return createdProduct;
    } else {
      return thunkAPI.rejectWithValue("failed to create product");
    }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
});

export const updateProductAsync = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("products/updateProduct", async (product, thunkAPI) => {
  try {
    const updatedProduct = await editProductInDB(product);
    if (updatedProduct) {
      return updatedProduct;
    } else {
      return thunkAPI.rejectWithValue("failed to update product");
    }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
});

export const getProductsAsync = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/getProducts", async (_, thunkAPI) => {
  try {
    const products = await getProductsFromDB();
    if (products) {
      return products;
    } else {
      return thunkAPI.rejectWithValue("failed to fetch products");
    }
  } catch (error) {
    throw new Error("Något gick fel vid hämtning av products.");
  }
});

export const getProductAsync = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/getProduct", async (id, thunkAPI) => {
  try {
    const products = await getProductFromDB(id);
    if (products) {
      return products;
    } else {
      return thunkAPI.rejectWithValue("failed to fetch product");
    }
  } catch (error) {
    throw new Error("Något gick fel vid hämtning av product.");
  }
});

const ProductSlice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    // setActiveProduct: (state, action) => {
    //   state.activeProduct = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.products.push(action.payload);
          state.error = null;
        }
      })
      .addCase(addProductAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkten skapades. Försök igen senare.";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.products.findIndex(
            (p) => p.id == action.payload.id
          );
          if (index) {
            state.products[index] = action.payload;
            state.error = null;
          } else {
            state.error = "Något gick fel vid uppdatering av produkt";
          }
        }
      })
      .addCase(updateProductAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkten skapades. Försök igen senare.";
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.products = action.payload;
          state.error = null;
        }
      })
      .addCase(getProductsAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkter hämtades. Försök igen senare.";
      })
      .addCase(getProductAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeProduct = action.payload;
          state.error = null;
        }
      })
      .addCase(getProductAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkten hämtades. Försök igen senare.";
      });
  },
});

export const ProductReduces = ProductSlice.reducer;
export type { ProductState };
// export const { setActiveProduct } = ProductSlice.actions;
