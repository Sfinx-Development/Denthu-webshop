import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Product } from "../slices/productSlice";

export default function Index() {
  const products: Product[] = [
    {
      id: "123",
      name: "Slipmaskin",
      description: "Superbra",
      price: 1000,
      in_store: true,
      weight: 200,
      height: 100,
      length: 100,
      width: 100,
      color: "grey",
      material: "iron",
      rabatt: 0,
      launch_date: "2024-05-01",
      category: "Elverktyg",
      imageUrl:
        "https://stormcdn1032.azureedge.net/6451d9da-e08d-416c-b80a-d30375c6c9c1.jpg?preset=listX2&format=webp",
    },
    {
      id: "456",
      name: "Hammare",
      description: "Stark och hållbar",
      price: 150,
      in_store: true,
      weight: 500,
      height: 50,
      length: 200,
      width: 30,
      color: "black",
      material: "steel",
      rabatt: 0,
      launch_date: "2024-04-01",
      category: "Handverktyg",
      imageUrl:
        "https://stormcdn1032.azureedge.net/85c839fe-6f04-4aff-ab1e-b13f5617ee89.jpg?preset=listX2&format=webp",
    },
    {
      id: "789",
      name: "Skruvmejsel",
      description: "Perfekt för småskruvar",
      price: 75,
      in_store: true,
      weight: 100,
      height: 20,
      length: 150,
      width: 20,
      color: "red",
      material: "steel",
      rabatt: 0,
      launch_date: "2024-06-01",
      category: "Handverktyg",
      imageUrl:
        "https://stormcdn1032.azureedge.net/5458c7ff-b1e8-4ef5-9005-0e7f9d8ec22d.jpg?preset=listX2&format=webp",
    },
  ];

  const groupedProducts = Object.values(
    products.reduce((acc: { [key: string]: Product }, product) => {
      if (!acc[product.category]) {
        acc[product.category] = product;
      }
      return acc;
    }, {})
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={4}>
        {groupedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ boxShadow: 3 }}>
              <NavLink
                to={`/category/${product.category}`}
                style={{ textDecoration: "none" }}
              >
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
                    {product.category}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="div"
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
