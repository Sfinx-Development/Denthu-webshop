/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addCategoryToDB,
  editCategoryInDB,
  getCategoryFromDB,
  getCategorysFromDB,
  getCategoriesByIdFromDB
} from "../api/category";

export interface Category {
  id: string;
  category: string;
  imageUrl: string;
}

const storedCategorys = localStorage.getItem("categorys");
const storedActiveCategory = localStorage.getItem("activeCategory");

interface CategoryState {
  categorys: Category[];
  activeCategory: Category | undefined;
  error: string | null;
}

export const initialState: CategoryState = {
  categorys: storedCategorys ? JSON.parse(storedCategorys) : [],
  activeCategory: storedActiveCategory
    ? JSON.parse(storedActiveCategory)
    : undefined,
  error: null,
};

export const addcategoryAsync = createAsyncThunk<
  Category,
  Category,
  { rejectValue: string }
>("categorys/addCategory", async (category, thunkAPI) => {
  try {
    const createdCategory = await addCategoryToDB(category);
    if (createdCategory) {
      return createdCategory;
    } else {
      return thunkAPI.rejectWithValue("failed to create Category");
    }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
});

export const updateCategoryAsync = createAsyncThunk<
  Category,
  Category,
  { rejectValue: string }
>(" categorys/updateCategory", async (category, thunkAPI) => {
  try {
    const updatedCategory = await editCategoryInDB(category);
    if (updatedCategory) {
      return updatedCategory;
    } else {
      return thunkAPI.rejectWithValue("failed to update Category");
    }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
});

export const getCategorysAsync = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categorys/getCategorys", async (_, thunkAPI) => {
  try {
    const categorys = await getCategorysFromDB();
    if (categorys) {
      localStorage.setItem("categorys", JSON.stringify(categorys));
      return categorys;
    } else {
      return thunkAPI.rejectWithValue("failed to fetch Categorys");
    }
  } catch (error) {
    throw new Error("Något gick fel vid hämtning av Categorys.");
  }
});

export const getCategorysByIdAsync = createAsyncThunk<
  Category[],
  string [],
  { rejectValue: string }
>("categorys/getCategorysById", async (ids, thunkAPI) => {
  try {
    const categorys = await getCategoriesByIdFromDB(ids);
    if (categorys) {
      localStorage.setItem("categorys", JSON.stringify(categorys));
      return categorys;
    } else {
      return thunkAPI.rejectWithValue("failed to fetch Categorys");
    }
  } catch (error) {
    throw new Error("Något gick fel vid hämtning av Categorys.");
  }
});

export const getCategoryAsync = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("Categorys/getCategory", async (id, thunkAPI) => {
  try {
    const Categorys = await getCategoryFromDB(id);
    if (Categorys) {
      return Categorys;
    } else {
      return thunkAPI.rejectWithValue("failed to fetch Category");
    }
  } catch (error) {
    throw new Error("Något gick fel vid hämtning av Category.");
  }
});

const Categoryslice = createSlice({
  name: "Category",
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      localStorage.setItem("activeCategory", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addcategoryAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.categorys.push(action.payload);
          state.activeCategory = action.payload;
          state.error = null;
        }
      })
      .addCase(addcategoryAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkten skapades. Försök igen senare.";
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.categorys.findIndex(
            (p) => p.id == action.payload.id
          );
          if (index) {
            state.categorys[index] = action.payload;
            state.error = null;
          } else {
            state.error = "Något gick fel vid uppdatering av produkt";
          }
        }
      })
      .addCase(updateCategoryAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkten skapades. Försök igen senare.";
      })
      .addCase(getCategorysAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.categorys = action.payload;
          state.error = null;
        }
      })
      .addCase(getCategorysAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkter hämtades. Försök igen senare.";
      })
      .addCase(getCategorysByIdAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.categorys = action.payload;
          state.error = null;
        }
      })
      .addCase(getCategorysByIdAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkter hämtades. Försök igen senare.";
      })
      .addCase(getCategoryAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeCategory = action.payload;
          state.error = null;
        }
      })
      .addCase(getCategoryAsync.rejected, (state) => {
        state.error =
          "Något gick fel när produkten hämtades. Försök igen senare.";
      });
  },
});

export const CategoryReduces = Categoryslice.reducer;
export type { CategoryState };
export const { setActiveCategory } = Categoryslice.actions;
