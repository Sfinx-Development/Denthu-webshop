// import { Box, Typography } from "@mui/material";

// export default function ProductDetail() {
//   return (
//     <Box>
//       <Typography>EN PRODUKT DETAIL SIDA</Typography>
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import { Box, Typography, CardMedia } from "@mui/material";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/config";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  description: string; // Lägg till andra fält som behövs för produktdetaljer
}

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <Typography variant="body1" component="p">
        {product.description}
      </Typography>
      {/* Lägg till andra produktdetaljer här */}
    </Box>
  );
}

