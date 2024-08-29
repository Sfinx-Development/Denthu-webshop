import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Product } from "../slices/productSlice";
import { useAppSelector } from "../slices/store";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const products = useAppSelector((state) => state.productSlice.products);
  const [result, setResult] = useState<Product[]>([]);

  useEffect(() => {
    if (search === "") {
      setResult([]);
      return;
    }

    const foundProducts = products.filter((p) =>
      p.name.toLowerCase().startsWith(search.toLowerCase())
    );

    setResult(foundProducts);
  }, [search, products]);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        boxShadow: 1,
        borderRadius: 1,
      }}
    >
      <TextField
        label="Sök produkter"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          "& .MuiInputLabel-root": {
            color: "text.secondary",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "text.primary",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "divider",
            },
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
        }}
      />
      {result.length > 0 && (
        <List
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            p: 0,
            bgcolor: "background.paper",
          }}
        >
          {result.map((product) => (
            <ListItem
              button
              key={product.id}
              component="a"
              href={`/product/${product.id}`}
            >
              <ListItemAvatar>
                <Avatar
                  src={product.imageUrl}
                  alt={product.name}
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText primary={product.name} />
            </ListItem>
          ))}
        </List>
      )}
      {result.length === 0 && search && (
        <Box sx={{ p: 2, color: "text.secondary" }}>Ingen produkt hittades</Box>
      )}
    </Box>
  );
}
