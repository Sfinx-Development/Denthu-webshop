import { Box, CardMedia, IconButton, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../api/config";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartItem, updateItem } from "../slices/cartSlice";
import AddtoCartButton from "../components/AddToCartButton";
import { clearEmailSent } from "../slices/orderSlice";
import { Product } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";
import { v4 as uuidv4 } from "uuid";

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cartSlice.cart);

  useEffect(() => {
    dispatch(clearEmailSent(false));
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.error("No such product!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product: ", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = (productId: string) => {
    if (cart && product) {
      const itemExists = cart.items.find((i) => i.product_id === product.id);

      if (itemExists) {
        // Om produkten redan finns i varukorgen, öka kvantiteten med 1
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
        // Om produkten inte finns i varukorgen, lägg till den med kvantitet 1
        const updatedItem: CartItem = {
          product_id: product.id,
          cart_id: cart.id,
          price: product.price,
          quantity: 1,
          id: uuidv4(), 
        };
        dispatch(updateItem(updatedItem));
      }
    }
  };

  // const handleAddToCart = (productId: string) => {
  //   if (cart && product) {
  //     const itemExists = cart.items.find((i) => i.product_id == product.id);
  //     if (itemExists && product.amount > 0) {
  //       const itemAmountBiggerThanItemAmountPlusOne =
  //         product.amount >= itemExists.quantity + 1;
  //       if (itemAmountBiggerThanItemAmountPlusOne) {
  //         const updatedItem: CartItem = {
  //           ...itemExists,
  //           quantity: itemExists.quantity + 1,
  //         };
  //         dispatch(updateItem(updatedItem));
  //       }
  //     } else {
  //       const updatedItem: CartItem = {
  //         product_id: product.id,
  //         cart_id: cart.id,
  //         price: product.price,
  //         quantity: 1,
  //         id: "123", // Generate ID or handle properly.
  //       };
  //       dispatch(updateItem(updatedItem));
  //     }
  //   }
  // };

  const handleRemoveFromCart = () => {
    if (cart && product) {
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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!product) {
    return <Typography>Product not found.</Typography>;
  }

  const cartItem = cart?.items.find((item) => item.product_id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>
        {product.name}
      </Typography>
      <CardMedia
        component="img"
        alt={product.name}
        image={product.imageUrl}
        sx={{ height: "300px", objectFit: "contain", marginBottom: 2 }}
      />
      <Typography variant="body1" component="p" sx={{ whiteSpace: "pre-wrap" }}>
        {product.description}
      </Typography>
      <Typography variant="body1" component="p">
        {product.price} SEK
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
        <IconButton onClick={handleRemoveFromCart} disabled={quantity <= 0}>
          <RemoveIcon />
        </IconButton>
        <Typography sx={{ marginX: 2 }}>{quantity}</Typography>

        <IconButton onClick={() => handleAddToCart(product.id)}>
          <AddIcon />
        </IconButton>

        {/* <IconButton onClick={() => handleAddToCart(product.id)}> 
          <AddIcon />
        </IconButton> */}
      </Box>

      <AddtoCartButton product={product} />

      {/* Lägg till andra produktdetaljer här */}
    </Box>
  );
}
