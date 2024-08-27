import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getProductsAsync, Product } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function Index() {
  const products = useAppSelector((state) => state.productSlice.products);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProductsAsync());
  }, [dispatch]);

  const groupedProducts = Object.values(
    products.reduce((acc: { [key: string]: Product }, product) => {
      if (!acc[product.category]) {
        acc[product.category] = product;
      }
      return acc;
    }, {})
  );

  return (
    <Box sx={{ width: "100%", padding: 4, backgroundColor: "#f4f4f4" }}>
      <Grid container spacing={4}>
        {groupedProducts.map((product) => (
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
              <NavLink
                to={`/category/${product.category}`}
                style={{ textDecoration: "none" }}
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
                      fontSize: { xs: "1rem", md: "1.1rem" }, // Mindre fontstorlek
                      letterSpacing: 0.5, // Minskad bokstavsavstånd
                      whiteSpace: "nowrap", // Förhindrar radbrytning
                      overflow: "hidden", // Döljer text som går utanför
                      textOverflow: "ellipsis", // Lägger till "..." om texten är för lång
                    }}
                  >
                    {product.category}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      color: "#555",
                      marginTop: 1,
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {product.name}
                  </Typography>
                </Box>
              </NavLink>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
