import { Box, Grid, Card, CardMedia, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Product } from "../slices/productSlice";

export default function CategoryProductPage() {
  const { category } = useParams<{ category: string }>();

  const products: Product[] = [
    // Samma lista med produkter som i din `Index` komponent
  ];

  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {category}
      </Typography>
      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                alt={product.name}
                image={product.imageUrl}
                sx={{
                  height: { xs: "170px", md: "250px" },
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Box sx={{ padding: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  {product.description}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
