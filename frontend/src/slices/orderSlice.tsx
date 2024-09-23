/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Paid } from "../../swedbankTypes";
import { addOrderToDB, editOrderInDB, getOrderFromDB } from "../api/order";

export interface Order {
  shippingAddress: string;
  id: string;
  reference: string;
  total_amount: number;
  vat_amount: number;
  created_date: string;
  status: string;
  items: OrderItem[];
  paymentInfo?: Paid;
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
  guestPhone?: string;
  shippingMethod: string;
  shippingCost: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  vatPercent: number; // New field
  vatAmount: number; // New field
}

interface OrderState {
  order: Order | null;
  emailSent: boolean;
  error: string | null;
}

const getInitialOrderState = (): OrderState => {
  const storedOrder = localStorage.getItem("order");
  const storedEmailSent = localStorage.getItem("emailSent");
  return storedOrder
    ? {
        order: JSON.parse(storedOrder),
        error: null,
        emailSent: storedEmailSent ? true : false,
      }
    : { order: null, error: null, emailSent: false };
};

const initialState: OrderState = getInitialOrderState();

const calculateVatAmount = (price: number, vatPercent: number): number => {
  const vatAmount = price * (vatPercent / (100 + vatPercent));
  return Math.round(vatAmount);
};

const calculateTotalVat = (items: OrderItem[]): number => {
  return items.reduce(
    (total, item) => total + item.vatAmount * item.quantity,
    0
  );
};

const calculateTotalAmount = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const addOrderAsync = createAsyncThunk<
  Order,
  Order,
  { rejectValue: string }
>("orders/addOrder", async (order, thunkAPI) => {
  try {
    order.items.forEach((item) => {
      item.vatPercent = 25; // 25% VATPERCENT
      item.vatAmount = calculateVatAmount(item.price, item.vatPercent);
    });

    order.total_amount = calculateTotalAmount(order.items);
    order.vat_amount = calculateTotalVat(order.items);

    const createdOrder = await addOrderToDB(order);

    if (createdOrder) {
      localStorage.setItem("order", JSON.stringify(createdOrder));
      return createdOrder;
    } else {
      return thunkAPI.rejectWithValue("failed to create order");
    }
  } catch (error) {
    throw new Error("Något gick fel vid skapande av order.");
  }
});

export const updateOrderAsync = createAsyncThunk<
  Order,
  Order,
  { rejectValue: string }
>("orders/updateOrder", async (order, thunkAPI) => {
  try {
    const updatedItems = order.items.map((item) => {
      const newItem = { ...item };
      newItem.vatPercent = item.vatAmount || 25; // 25% VAT
      newItem.vatAmount = calculateVatAmount(newItem.price, newItem.vatPercent);
      return newItem;
    });

    const updatedOrder = {
      ...order,
      items: updatedItems,
      // total_amount: calculateTotalAmount(updatedItems),
      // vat_amount: calculateTotalVat(updatedItems),
      total_amount: calculateTotalAmount(updatedItems),
      vat_amount: calculateTotalVat(updatedItems),
    };

    const response = await editOrderInDB(updatedOrder);
    if (response) {
      return response;
    } else {
      console.error("FAILED TO UPDATE ORDER: No order returned");
      return thunkAPI.rejectWithValue(
        "Failed to update order: No order returned"
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Något gick fel vid uppdatering av order."
    );
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    setEmailSent: (state, action: PayloadAction<boolean>) => {
      state.emailSent = action.payload;
      localStorage.setItem("emailSent", JSON.stringify(true));
    },
    clearEmailSent: (state, action: PayloadAction<boolean>) => {
      state.emailSent = action.payload;
      localStorage.removeItem("emailSent");
    },
    addItem: (state, action: PayloadAction<OrderItem>) => {
      if (state.order) {
        const item = action.payload;
        item.vatPercent = 25; // 25% VAT
        item.vatAmount = calculateVatAmount(item.price, item.vatPercent);

        state.order.items.push(item);
        state.order.total_amount = calculateTotalAmount(state.order.items);
        state.order.vat_amount = calculateTotalVat(state.order.items);

        localStorage.setItem("order", JSON.stringify(state.order));
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      if (state.order) {
        state.order.items = state.order.items.filter(
          (item) => item.id !== action.payload
        );
        state.order.total_amount = calculateTotalAmount(state.order.items);
        state.order.vat_amount = calculateTotalVat(state.order.items);

        localStorage.setItem("order", JSON.stringify(state.order));
      }
    },
    updateItem: (state, action: PayloadAction<OrderItem>) => {
      if (state.order) {
        const index = state.order.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index >= 0) {
          const updatedItem = action.payload;
          updatedItem.vatPercent = 25;
          updatedItem.vatAmount = calculateVatAmount(
            updatedItem.price,
            updatedItem.vatPercent
          );

          if (updatedItem.quantity > 0) {
            state.order.items[index] = updatedItem;
          } else {
            state.order.items = state.order.items.filter(
              (item) => item.id !== updatedItem.id
            );
          }

          state.order.total_amount = calculateTotalAmount(state.order.items);
          state.order.vat_amount = calculateTotalVat(state.order.items);

          localStorage.setItem("order", JSON.stringify(state.order));
        }
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
          localStorage.setItem("order", JSON.stringify(action.payload));
          state.error = null;
        }
      })
      .addCase(updateOrderAsync.rejected, (state) => {
        state.error =
          "Något gick fel när ordern uppdaterades. Försök igen senare.";
      });
  },
});

export const { setOrder, addItem, removeItem, clearOrder, updateItem, setEmailSent, clearEmailSent } =
  orderSlice.actions;
export const OrderReducer = orderSlice.reducer;
