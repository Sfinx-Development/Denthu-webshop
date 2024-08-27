import { Box, Grid, Card, CardMedia, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Product } from "../slices/productSlice";

export default function CategoryProductPage() {
  const { category } = useParams<{ category: string }>();

  // Din mockade produktlista
  const products: Product[] = [
    // {
    //   id: "123",
    //   name: "Slipmaskin",
    //   description: "Superbra",
    //   price: 1000,
    //   in_store: true,
    //   weight: 200,
    //   height: 100,
    //   length: 100,
    //   width: 100,
    //   color: "grey",
    //   material: "iron",
    //   rabatt: 0,
    //   launch_date: "2024-05-01",
    //   category: "Elverktyg",
    //   imageUrl:
    //     "https://stormcdn1032.azureedge.net/6451d9da-e08d-416c-b80a-d30375c6c9c1.jpg?preset=listX2&format=webp",
    // },
    {
      id: "101",
      name: "Slippapper",
      description: "Bra för slipning",
      price: 50,
      in_store: true,
      weight: 50,
      height: 10,
      length: 100,
      width: 100,
      color: "brown",
      material: "sandpaper",
      rabatt: 0,
      launch_date: "2024-07-01",
      category: "Förbrukningsmaterial",
      imageUrl: "https://i.imgur.com/ASqkaxv.jpeg",
    },
    {
      id: "102",
      name: "Spackel",
      description: "Perfekt för jämna ytor",
      price: 120,
      in_store: true,
      weight: 300,
      height: 50,
      length: 150,
      width: 100,
      color: "white",
      material: "plastic",
      rabatt: 0,
      launch_date: "2024-07-01",
      category: "Förbrukningsmaterial",
      imageUrl: "https://i.imgur.com/9QJRYaT.jpeg",
    },
    {
      id: "103",
      name: "Sliprondell",
      description: "Perfekt för slipmaskin",
      price: 100,
      in_store: true,
      weight: 150,
      height: 20,
      length: 150,
      width: 150,
      color: "red",
      material: "sandpaper",
      rabatt: 0,
      launch_date: "2024-07-01",
      category: "Förbrukningsmaterial",
      imageUrl: "https://i.imgur.com/Qm3GjXM.jpeg",
    },
    // Andra produkter
  ];

  // Filtrera produkter baserat på kategorin
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  // Kontrollera om filtreringen fungerar genom att logga resultatet
  console.log("Filtered Products: ", filteredProducts);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {category}
      </Typography>
      <Grid container spacing={4}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    component="div"
                  >
                    Pris: {product.price} kr
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            Inga produkter tillgängliga i denna kategori.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
