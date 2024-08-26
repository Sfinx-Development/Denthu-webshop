/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addOrderToDB, editOrderInDB, getOrderFromDB } from "../api/order";
import { PaymentInfo } from "./paymentSlice";

export interface Order {
  id: string;
  reference: string;
  total_amount: number;
  created_date: string;
  status: string;
  items: OrderItem[];
  paymentInfo?: PaymentInfo;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

interface OrderState {
  order: Order | null;
  error: string | null;
}

const getInitialOrderState = (): OrderState => {
  const storedOrder = localStorage.getItem("order");
  return storedOrder
    ? { order: JSON.parse(storedOrder), error: null }
    : { order: null, error: null };
};

const initialState: OrderState = getInitialOrderState();

export const addOrderAsync = createAsyncThunk<
  Order,
  Order,
  { rejectValue: string }
>("orders/addOrder", async (order, thunkAPI) => {
  try {
    const totalAmount =
      order.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ||
      0;
    order.total_amount = totalAmount;
    const createdOrder = await addOrderToDB(order);
    if (createdOrder) {
      localStorage.setItem("order", JSON.stringify(createdOrder));
      return createdOrder;
    } else {
      return thunkAPI.rejectWithValue("failed to create order");
    }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
});

export const updateOrderAsync = createAsyncThunk<
  Order,
  Order,
  { rejectValue: string }
>("orders/updateOrder", async (order, thunkAPI) => {
  try {
    const updatedOrder = await editOrderInDB(order);
    if (updatedOrder) {
      return updatedOrder;
    } else {
      return thunkAPI.rejectWithValue("failed to update order");
    }
  } catch (error) {
    throw new Error("Något gick fel vid uppdatering av order.");
  }
});

export const getOrderAsync = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/getOrder", async (userid, thunkAPI) => {
  try {
    const order = await getOrderFromDB(userid);
    if (order) {
      return order;
    } else {
      return thunkAPI.rejectWithValue("failed to fetch order");
    }
  } catch (error) {
    throw new Error("Något gick fel vid hämtning av order.");
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order>) => {
      state.order = action.payload;
      localStorage.setItem("order", JSON.stringify(state.order));
    },
    addItem: (state, action: PayloadAction<OrderItem>) => {
      if (state.order) {
        state.order.items.push(action.payload);
        localStorage.setItem("order", JSON.stringify(state.order));
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      if (state.order) {
        state.order.items = state.order.items.filter(
          (item) => item.id !== action.payload
        );
        localStorage.setItem("order", JSON.stringify(state.order));
      }
    },
    updateItem: (state, action: PayloadAction<OrderItem>) => {
      if (state.order) {
        const index = state.order.items.findIndex(
          (item) => item.id == action.payload.id
        );
        if (index >= 0 && action.payload.quantity > 0) {
          state.order.items[index] = action.payload;
        } else if (index >= 0 && action.payload.quantity == 0) {
          state.order.items = state.order.items.filter(
            (item) => item.id !== action.payload.id
          );
        }
        localStorage.setItem("order", JSON.stringify(state.order));
      }
    },
    clearOrder: (state) => {
      state.order = null;
      localStorage.removeItem("order");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.order = action.payload;
          state.error = null;
        }
      })
      .addCase(getOrderAsync.rejected, (state) => {
        state.error = "Något gick fel när ordern hämtades. Försök igen senare.";
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.order = action.payload;
          state.error = null;
        }
      })
      .addCase(addOrderAsync.rejected, (state) => {
        state.error =
          "Något gick fel när ordern uppdaterades. Försök igen senare.";
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.order = action.payload;
          state.error = null;
        }
      })
      .addCase(updateOrderAsync.rejected, (state) => {
        state.error =
          "Något gick fel när ordern uppdaterades. Försök igen senare.";
      });
  },
});

export const { setOrder, addItem, removeItem, clearOrder, updateItem } =
  orderSlice.actions;
export const OrderReducer = orderSlice.reducer;
