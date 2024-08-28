import { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardMedia } from "@mui/material";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../api/config";

// import { db } from "../firebaseConfig"; // Se till att detta är rätt importväg till din firebaseConfig

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

export default function CategoryProducts() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Query som hämtar produkter som tillhör en viss kategori
        const q = query(
          collection(db, "products"),
          where("category", "==", categoryName)  // Filtrera på kategori
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (products.length === 0) {
    return <Typography>No products found for this category.</Typography>;
  }

  return (
    <Box sx={{ width: "100%", padding: 4, backgroundColor: "#f4f4f4" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ marginBottom: 4, textTransform: "uppercase", textAlign: "center" }}
      >
        {categoryName}
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#fff",
                "&:hover": {
                  boxShadow: "0px 20px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                alt={product.name}
                image={product.imageUrl}
                sx={{
                  height: { xs: "200px", md: "300px" },
                  objectFit: "contain",
                  transition: "transform 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
              <Box sx={{ padding: 3 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "#333",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
