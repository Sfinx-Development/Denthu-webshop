import { Box, Grid, Typography, Card, CardMedia } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../slices/store";
import { Product } from "../slices/productSlice";

export default function CategoryProducts() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const products = useAppSelector((state) => state.productSlice.products);

  const filteredProducts = products.filter(
    (product: Product) => product.category === categoryName
  );

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
        {filteredProducts.map((product) => (
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
