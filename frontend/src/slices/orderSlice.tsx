/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Paid } from "../../swedbankTypes";
import {
  addOrderToDB,
  editOrderInDB,
  getAllOrdersFromDB,
  getOrderFromDB,
} from "../api/order";
import { Product } from "./productSlice";

export interface Order {
  shippingAddress?: string;
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
  shippingMethod?: string;
  shippingCost?: number;
  incomingPaymentOrderId?: string;
  isShipped: boolean;
  isPickedUp: boolean;
  trackingLink?: string;
  updateTimestamp?: string;
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
  orders: Order[];
  order: Order | null;
  emailSent: boolean;
  error: string | null;
  isLoading: boolean;
}

const getInitialOrderState = (): OrderState => {
  const storedOrder = localStorage.getItem("order");
  const storedOrders = localStorage.getItem("orders");
  const storedEmailSent = localStorage.getItem("emailSent");
  return storedOrder
    ? {
        order: JSON.parse(storedOrder),
        error: null,
        emailSent: storedEmailSent ? true : false,
        orders: storedOrders ? (JSON.parse(storedOrders) as Order[]) : [],
        isLoading: false,
      }
    : {
        order: null,
        error: null,
        emailSent: false,
        orders: storedOrders ? (JSON.parse(storedOrders) as Order[]) : [],
        isLoading: false,
      };
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

function getProduct(
  productId: string,
  products: Product[]
): Product | undefined {
  return products.find((p) => p.id == productId);
}

const calculateTotalAmount = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

function getShippingCost(order: Order, products: Product[]) {
  if (order.shippingMethod == "pickup") {
    return 0;
  } else {
    const productWeightTogether = order.items.reduce((total, item) => {
      const product = getProduct(item.product_id, products);
      if (product) {
        return total + product.weight * item.quantity;
      } else {
        return 0;
      }
    }, 0);

    const cost = availableShippingOptions(productWeightTogether);
    return cost;
  }
}

const availableShippingOptions = (weight: number): number => {
  if (weight > 0 && weight <= 1000) {
    return 80;
  } else if (weight > 1000 && weight <= 2000) {
    return 118;
  } else if (weight > 2000 && weight <= 3000) {
    return 132;
  } else if (weight > 3000 && weight <= 5000) {
    return 161;
  } else if (weight > 5000 && weight <= 10000) {
    return 215;
  } else if (weight > 10000 && weight <= 15000) {
    return 260;
  } else if (weight > 15000 && weight <= 20000) {
    return 308;
  } else {
    //hanteras senare -> kanske dennis fylla i själv??
    return 0;
  }
};

export const fetchAllOrdersAsync = createAsyncThunk<
  Order[],
  undefined,
  { rejectValue: string }
>("orders/fetchAllOrders", async (_, thunkAPI) => {
  try {
    const orders = await getAllOrdersFromDB();
    if (orders) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
    return orders;
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to fetch orders");
  }
});

//TA IN PRODUCTS SOM ARGUMENT
export const addOrderAsync = createAsyncThunk<
  Order, // Resultatet som returneras när thunk är klar
  [Order, Product[]], // Två argument: Order och en string (exempelvis ett användar-id eller annat värde)
  { rejectValue: string } // Hantering av fel
>("orders/addOrder", async ([order, products], thunkAPI) => {
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
    const updatedItems = order.items.filter((i) => i.quantity > 0);

    const updatedOrder: Order = {
      ...order,
      items: updatedItems,
    };
    const response = await editOrderInDB(updatedOrder);
    if (response) {
      localStorage.setItem("order", JSON.stringify(response));
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

export const updateOrderFrakt = createAsyncThunk<
  Order,
  [Order, Product[], string],
  { rejectValue: string }
>("orders/updateOrderFrakt", async ([order, products, method], thunkAPI) => {
  try {
    const cost = getShippingCost(order, products);
    const totalShippingCost = cost * 100;
    const updatedOrder: Order = {
      ...order,
      total_amount: order.total_amount + totalShippingCost,
      shippingCost: cost,
      shippingMethod: method,
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

export const addItemToOrder = createAsyncThunk<
  Order,
  { order: Order; item: OrderItem },
  { rejectValue: string }
>("orders/addItemToOrder", async ({ order, item }, thunkAPI) => {
  try {
    const newItem = { ...item };
    newItem.vatPercent = 25;
    newItem.vatAmount = calculateVatAmount(newItem.price, newItem.vatPercent);

    const updatedItems = [...order.items, newItem];

    const updatedTotalAmount = calculateTotalAmount(updatedItems);
    const updatedVatAmount = calculateTotalVat(updatedItems);

    const updatedOrder: Order = {
      ...order,
      items: updatedItems,
      total_amount: updatedTotalAmount,
      vat_amount: updatedVatAmount,
    };

    localStorage.setItem("order", JSON.stringify(updatedOrder));
    updateOrderAsync(updatedOrder);
    return updatedOrder;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Något gick fel vid tillägg av produkt."
    );
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
      localStorage.removeItem("order");
      state.order = null;
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
      .addCase(updateOrderFrakt.fulfilled, (state, action) => {
        if (action.payload) {
          state.order = action.payload;
          localStorage.setItem("order", JSON.stringify(action.payload));
          state.error = null;
        }
      })
      .addCase(updateOrderFrakt.rejected, (state) => {
        state.error =
          "Något gick fel när ordern uppdaterades. Försök igen senare.";
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
      .addCase(addItemToOrder.fulfilled, (state, action) => {
        if (action.payload) {
          state.order = action.payload;
          state.error = null;
        }
      })
      .addCase(addItemToOrder.rejected, (state) => {
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
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllOrdersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.orders = [];
      });
  },
});

export const {
  setOrder,
  addItem,
  removeItem,
  clearOrder,
  updateItem,
  setEmailSent,
  clearEmailSent,
} = orderSlice.actions;
export const OrderReducer = orderSlice.reducer;
