import { keyframes } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate /* useParams */ } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CartItem, updateItem } from "../slices/cartSlice";
import { addOrderAsync, Order, OrderItem } from "../slices/orderSlice";
import { Product, updateProductAsync } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";
// import { useParams } from "react-router-dom";
// import { db } from "../api/config";
// import { doc, getDoc } from "firebase/firestore";

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

  // const { productId } = useParams<{ productId: string }>();
  // const [product, setProduct] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);


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
      const filteredGroupedItems = Object.values(grouped).filter(item => item.quantity > 0);
      setGroupedItems(filteredGroupedItems);
    }
  }, [cart]);
  


  // useEffect(() => {
  //   if (cart) {
  //     const grouped = cart.items.reduce(
  //       (acc: Record<string, GroupedCartItem>, item) => {
  //         // const key = `${item.product_id}-${item.size}`;
  //         const key = `${item.product_id}`;
  //         if (!acc[key]) {
  //           acc[key] = { ...item, quantity: 0 };
  //         }
  //         acc[key].quantity += item.quantity;
  //         return acc;
  //       },
  //       {}
  //     );
  //     setGroupedItems(Object.values(grouped));
  //   }
  // }, [cart]);


 

 
  
  // function getProduct(productId: string ): Product | undefined {
  //   console.log("PRODUKTEEEEN", productId);


  //   return products.find((p) => p.id === productId);
  // }

  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id === productId && p.amount > 0);
  };
  


  // const sizesLeft = (product: Product, cartItem: CartItem) => {
  //   const size = product.sizes.find((s) => s.label == cartItem.size);
  //   return size ? size.amount : 0;
  // };


  // const updatedQuantity = (product: Product): [] => {
  //   const sizeMap: { [key: string]: number } = {};

  //   cart?.items
  //     .filter((item) => item.product_id === product.id)
      // .forEach((item) => {
      //   if (sizeMap[item.size]) {
      //     sizeMap[item.size] += item.quantity;
      //   } else {
      //     sizeMap[item.size] = item.quantity;
      //   }
      // });

  //   return product.sizes.map((size: { label: string | number; amount: number; }) => {
  //     const purchasedQuantity = sizeMap[size.label] || 0;
  //     const updatedQuantity = size.amount - purchasedQuantity;

  //     return {
  //       label: size.label,
  //       amount: updatedQuantity,
  //     };
  //   });
  // };
=======
  const updatedQuantity = (product: Product): [] => {
    const sizeMap: { [key: string]: number } = {};

    cart?.items
      .filter((item) => item.product_id === product.id)
      .forEach((item) => {
        if (sizeMap[item.size]) {
          sizeMap[item.size] += item.quantity;
        } else {
          sizeMap[item.size] = item.quantity;
        }
      });

    return product.sizes.map(
      (size: { label: string | number; amount: number }) => {
        const purchasedQuantity = sizeMap[size.label] || 0;
        const updatedQuantity = size.amount - purchasedQuantity;

        return {
          label: size.label,
          amount: updatedQuantity,
        };
      }
    );
  };


  const handleAddToCart = (product: Product /*, sizeLabel: string*/) => {
    if (cart) {
      const itemExists = cart.items.find(
        (i) => i.product_id === product.id /* && i.size === sizeLabel */
      );
      // if (
      //   itemExists &&
      //   product &&
      //   itemExists.quantity < sizesLeft(product, itemExists)
      // ) {
      if (itemExists && product) {
        const updatedItem: CartItem = {
          ...itemExists,
          quantity: itemExists.quantity + 1,
        };
        dispatch(updateItem(updatedItem));
      }
    }
  };

  const handleRemoveFromCart = (product: Product /*, sizeLabel: string*/) => {
    if (cart) {
      const itemExists = cart.items.find(
        (i) => i.product_id === product.id /* && i.size === sizeLabel */
      );
      if (itemExists && itemExists.quantity > 0) {
        const updatedItem: CartItem = {
          ...itemExists,
          quantity: itemExists.quantity - 1,
        };
        dispatch(updateItem(updatedItem));
      }
    }
  };

  const handleMakeOrder = () => {
    const orderItems = cart?.items.map((item) => {
      const orderItem: OrderItem = {
        id: uuidv4(),
        order_id: uuidv4(),
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price * 100,
        // vatPercent: 1200,
        // vatAmount: 0,
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
        // vat_amount: totalPrice,
        created_date: new Date().toISOString(),
        status: "Waiting for payment",
      };

      dispatch(addOrderAsync(newOrder));
      // localStorage.removeItem("cart");
      navigate("/checkout");
      products.forEach((p) => {
        // const sizeArray = updatedQuantity(p);
        const productToUpdate: Product = {
          ...p,
          // in_store: p.sizes.some((s: { amount: number; }) => s.amount > 0),
          // sizes: sizeArray,
        };
        dispatch(updateProductAsync(productToUpdate));
      });
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
                  alt={`Product ${item.product_id}`}
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
                    onClick={() =>
                      handleAddToCart(product as Product /*, item.size*/)
                    }
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
            padding: 4,
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
