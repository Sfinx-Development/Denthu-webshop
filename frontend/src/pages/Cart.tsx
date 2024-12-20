import { keyframes } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CartItem, setCart, updateItem } from "../slices/cartSlice";
import { addOrderAsync, Order, OrderItem } from "../slices/orderSlice";
import {
  getProductsAsync,
  Product,
  updateProductAsync,
} from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

const fadeIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

type GroupedCartItem = CartItem & {
  quantity: number;
};

export default function Cart() {
  const cart = useAppSelector((state) => state.cartSlice.cart);
  const products = useAppSelector((state) => state.productSlice.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [groupedItems, setGroupedItems] = useState<GroupedCartItem[]>([]);
  const [productsRemoved, setProductsRemoved] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);
  useEffect(() => {
    checkIfProductsInStore();
  }, [products]);

  const checkIfProductsInStore = async () => {
    if (cart) {
      const updatedItems = cart.items.map((o) => {
        const productInOrder = products.find((p) => p.id === o.product_id);
        if (productInOrder) {
          //om den finns och om det finns fler i ordern än i lagret
          if (o.quantity > productInOrder.amount) {
            if (!productsRemoved.some((p) => p.id === productInOrder.id)) {
              //sätt i products not i store
              setProductsRemoved((prev) => [...prev, productInOrder]);
              // setProductsNotInStore(productsRemoved);
            }
            return {
              ...o,
              quantity: productInOrder.amount,
            };
          }
          if (productInOrder.amount === 0) {
            if (!productsRemoved.some((p) => p.id === productInOrder.id)) {
              setProductsRemoved((prev) => [...prev, productInOrder]);
              // setProductsNotInStore(productsRemoved);
            }
            return null;
          }
        }
        return o;
      });

      const filteredItems: CartItem[] = updatedItems.filter(
        (item): item is CartItem => item !== null
      );

      // Uppdatera kundvagnen
      if (cart?.items) {
        const updatedCartItems = cart.items.map((cartItem) => {
          const matchingOrderItem = filteredItems.find(
            (orderItem) => orderItem.product_id === cartItem.product_id
          );

          if (matchingOrderItem) {
            return {
              ...cartItem,
              quantity: matchingOrderItem.quantity, // Justera kvantitet
            };
          }

          // Ta bort objekt som inte längre finns i ordern
          if (!matchingOrderItem) {
            return null;
          }

          return cartItem;
        });

        // Filtrera bort null-objekt
        const filteredCartItems = updatedCartItems.filter(
          (item): item is CartItem => item !== null
        );

        // Uppdatera cart state
        dispatch(setCart({ ...cart, items: filteredCartItems }));
        // localStorage.setItem(
        //   "cart",
        //   JSON.stringify({ ...cart, items: filteredCartItems })
        // );
      }
    }
  };

  useEffect(() => {
    if (cart) {
      const grouped = cart.items.reduce(
        (acc: Record<string, GroupedCartItem>, item) => {
          const key = `${item.product_id}`;
          if (!acc[key]) {
            acc[key] = { ...item, quantity: 0 };
          }
          acc[key].quantity += item.quantity;
          return acc;
        },
        {}
      );
      const filteredGroupedItems = Object.values(grouped).filter(
        (item) => item.quantity > 0
      );
      setGroupedItems(filteredGroupedItems);
    }
  }, [cart]);

  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };

  const handleAddToCart = (productId: string) => {
    if (cart) {
      const product = getProduct(productId);
      if (product) {
        const itemExists = cart.items.find((i) => i.product_id == product.id);
        if (itemExists && productId && product.amount > 0) {
          const itemAmountBiggerThanItemAmountPlusOne =
            product.amount >= itemExists.quantity + 1;
          if (itemAmountBiggerThanItemAmountPlusOne) {
            const updatedItem: CartItem = {
              ...itemExists,
              quantity: itemExists.quantity + 1,
            };
            dispatch(updateItem(updatedItem));
          }
        } else {
          const updatedItem: CartItem = {
            product_id: product.id,
            cart_id: cart.id,
            price: product.price,
            quantity: 1,
            id: "123",
          };
          dispatch(updateItem(updatedItem));
        }
      }
    }
  };

  const handleRemoveFromCart = (product: Product) => {
    if (cart) {
      const itemExists = cart.items.find((i) => i.product_id == product.id);
      if (itemExists && itemExists.quantity > 0) {
        const updatedItem: CartItem = {
          ...itemExists,
          quantity: itemExists.quantity - 1,
        };
        dispatch(updateItem(updatedItem));
      }
    }
  };

  const handleMakeOrder = async () => {
    const orderItems = cart?.items.map((item) => {
      const product = products.find((p) => p.id == item.product_id);
      const orderItem: OrderItem = {
        id: uuidv4(),
        order_id: uuidv4(),
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price * 100,
        vatPercent: product?.vat_amount || 25,
        vatAmount: 0,
      };
      return orderItem;
    });
    if (orderItems) {
      const totalPrice =
        orderItems?.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ) || 0;
      const newOrder: Order = {
        id: uuidv4(),
        reference: "or-" + uuidv4(),
        items: orderItems,
        total_amount: totalPrice,
        vat_amount: 0,
        created_date: new Date().toISOString(),
        status: "Waiting for payment",
        isShipped: false,
        isPickedUp: false,
      };
      await dispatch(addOrderAsync([newOrder, products]));
      navigate("/checkout");
      // products.forEach((p) => {
      //   const productToUpdate: Product = {
      //     ...p,
      //   };
      //   await dispatch(updateProductAsync(productToUpdate));
      // });
    }
  };

  const calculateTotalPrice = () => {
    return cart?.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  const getTotalAmountPerProduct = (item: CartItem): number => {
    return item.price * item.quantity;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        padding: 0,
        margin: 0,
        width: "100%",
        minHeight: "100vh",
        zIndex: 1,
        animation: `${fadeIn} 1s ease-out`,
        backgroundColor: "white",
      }}
    >
      {!cart || cart?.items.length == 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingY: 2,
            width: "100%",
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, color: "#aaa", mb: 2 }} />
          <Typography
            sx={{ letterSpacing: 2, fontSize: 26, mb: 2, color: "#333" }}
          >
            Varukorgen är tom
          </Typography>
          <Typography sx={{ fontSize: 16, color: "#777", mb: 4 }}>
            Det ser ut som att du inte har lagt till några produkter i din
            varukorg än.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              padding: "10px 20px",
              fontSize: 16,
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "black",
            }}
          >
            <Typography>Fortsätt handla</Typography>
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingY: 1,
            width: { xs: "100%", md: "70%" },
            alignItems: "center",
            maxHeight: { xs: "auto", md: "600px" },
            overflowY: "auto",
            marginBottom: 2,
          }}
        >
          {productsRemoved.map((item) => {
            const product = getProduct(item.id);
            return (
              <Box
                key={`${item.id}`}
                sx={{
                  backgroundColor: "lightgrey",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  padding: 2,
                  width: "90%",
                  alignItems: "center",
                  marginBottom: 2,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: 2,
                }}
              >
                <img
                  src={product?.imageUrl}
                  alt={`Product ${product?.name}`}
                  style={{ height: 100, width: 80, objectFit: "cover" }}
                />
                <Box
                  sx={{
                    paddingX: { xs: 2, sm: 4 },
                    width: { xs: "100%", sm: "auto" },
                    textAlign: { xs: "center", sm: "left" },
                    marginBottom: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography sx={{ fontSize: 20, marginY: 1 }}>
                    {product?.name} {/* - {item.size} */}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {groupedItems.map((item) => {
            const product = getProduct(item.product_id);
            return (
              <Box
                key={`${item.product_id}`}
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  padding: 2,
                  width: "90%",
                  alignItems: "center",
                  marginBottom: 2,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: 2,
                }}
              >
                <img
                  src={product?.imageUrl}
                  alt={`Product ${product?.name}`}
                  style={{ height: 100, width: 80, objectFit: "cover" }}
                />
                <Box
                  sx={{
                    paddingX: { xs: 2, sm: 4 },
                    width: { xs: "100%", sm: "auto" },
                    textAlign: { xs: "center", sm: "left" },
                    marginBottom: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography sx={{ fontSize: 20, marginY: 1 }}>
                    {product?.name} {/* - {item.size} */}
                  </Typography>
                  <Typography sx={{ fontSize: 16, color: "#777" }}>
                    {item.quantity} st
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginX: { xs: "auto", sm: 0 },
                  }}
                >
                  <IconButton
                    onClick={() =>
                      handleRemoveFromCart(product as Product /*, item.size*/)
                    }
                    sx={{ marginRight: 1 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    onClick={() => handleAddToCart(item.product_id)}
                    sx={{ marginLeft: 1 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography sx={{ marginLeft: "auto", fontSize: 20 }}>
                  {getTotalAmountPerProduct(item)} kr
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
      {cart && cart.items.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#f8f8f8",
            width: { xs: "100%", md: "30%" },
            padding: { xs: 0, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 24, marginBottom: 2 }}>
            Orderöversikt
          </Typography>
          <Typography sx={{ fontSize: 16, marginBottom: 1 }}>
            Totalt pris: {calculateTotalPrice()} kr
          </Typography>
          <Button
            variant="contained"
            onClick={handleMakeOrder}
            sx={{
              width: "100%",
              backgroundColor: "black",
              color: "white",
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 2,
              textTransform: "none",
              marginTop: 2,
            }}
          >
            {/* Genomför köp */}
            Fortsätt till betalning
          </Button>
        </Box>
      )}
    </Box>
  );
}
