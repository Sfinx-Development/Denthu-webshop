import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Product } from "./productSlice";

export interface Cart {
  id: string;
  created_date: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

interface CartState {
  cart: Cart | undefined;
  isCheckVisible: boolean;
}

const createNewCart = (): Cart => {
  return {
    id: uuidv4(),
    created_date: new Date().toISOString(),
    items: [],
  };
};

const getInitialCartState = (): CartState => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    return { cart: JSON.parse(storedCart), isCheckVisible: false };
  } else {
    const newCart = createNewCart();
    localStorage.setItem("cart", JSON.stringify(newCart));
    return { cart: newCart, isCheckVisible: false };
  }
};

const initialState: CartState = getInitialCartState();

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        const existingItem = state.cart.items.find(
          (item) => item.product_id === action.payload.product_id
        );

        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.cart.items.push(action.payload);
        }

        localStorage.setItem("cart", JSON.stringify(state.cart));
        state.isCheckVisible = true;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(
          (item) => item.id !== action.payload
        );
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    updateItem: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        const index = state.cart.items.findIndex(
          (item) => item.id == action.payload.id
        );
        if (index >= 0 && action.payload.quantity > 0) {
          state.cart.items[index] = action.payload;
        } else if (index >= 0 && action.payload.quantity == 0) {
          state.cart.items = state.cart.items.filter(
            (item) => item.id !== action.payload.id
          );
        }
        localStorage.setItem("cart", JSON.stringify(state.cart));
        state.isCheckVisible = true;
      }
    },
    clearCart: (state) => {
      state.cart = undefined;
      localStorage.removeItem("cart");
    },
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.isCheckVisible = action.payload;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      if (!state.cart) {
        // Skapa en ny kundvagn om den inte finns
        const newCart = createNewCart();
        state.cart = newCart;
      }
      if (state.cart) {
        const product = action.payload;
        // Check if the product has amount > 0
        if (product.amount > 0) {
          const existingItem = state.cart.items.find(
            (item) => item.product_id === product.id
          );

          if (existingItem) {
            // Ensure there's enough stock before increasing the quantity
            if (existingItem.quantity + 1 <= product.amount) {
              existingItem.quantity += 1;
            } else {
              console.warn("Not enough stock available for this product.");
            }
          } else {
            // Ensure there is at least 1 in stock before adding
            if (product.amount > 0) {
              const newCartItem: CartItem = {
                id: uuidv4(),
                cart_id: state.cart.id,
                product_id: product.id,
                quantity: 1,
                price: product.price,
              };
              state.cart.items.push(newCartItem);
            } else {
              console.warn("This product is out of stock.");
            }
          }

          localStorage.setItem("cart", JSON.stringify(state.cart));
          state.isCheckVisible = true;
        } else {
          console.warn("This product is out of stock.");
        }
      }
    },
  },
});

export const {
  setCart,
  addItem,
  removeItem,
  clearCart,
  updateItem,
  setVisible,
  addToCart,
} = cartSlice.actions;
export const CartReducer = cartSlice.reducer;
