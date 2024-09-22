import { Box, CardMedia, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../api/config";
import AddtoCartButton from "../components/AddToCartButton";
import { clearEmailSent } from "../slices/orderSlice";
import { Product } from "../slices/productSlice";
import { useAppDispatch } from "../slices/store";

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!product) {
    return <Typography>Product not found.</Typography>;
  }

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

      <AddtoCartButton product={product} />

      {/* Lägg till andra produktdetaljer här */}
    </Box>
  );
}
