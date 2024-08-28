import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addcategoryAsync,
  Category,
  getCategorysAsync,
  setActiveCategory,
} from "../slices/categorySlice";
import {
  addProductAsync,
  Product,
  updateProductAsync,
} from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function AdminAddAndEdit() {
  const navigate = useNavigate();
  const { param } = useParams();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState("");

  const products = useAppSelector((state) => state.productSlice.products);
  const categories = useAppSelector((state) => state.categorySlice.categorys);
  const category = useAppSelector(
    (state) => state.categorySlice.activeCategory
  );
  const productToEdit = products.find((p) => p.id === param);

  const isNewProductMode = param === "ny";

  if (!productToEdit && !isNewProductMode) {
    return <Typography variant="h6">Ojdå, produkten hittades inte.</Typography>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    dispatch(getCategorysAsync());
  }, []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (category) {
      const product: Product = {
        id: productToEdit ? productToEdit.id : "default",
        name,
        description,
        price,
        imageUrl,
        amount,
        categoryId: category.id,
        discount,
        launch_date: new Date().toISOString(),
      };

      if (productToEdit) {
        dispatch(updateProductAsync(product));
      } else if (isNewProductMode) {
        dispatch(addProductAsync(product));
      }

      setName("");
      setDescription("");
      setPrice(0);
      setAmount(0);
      setDiscount(0);
      setImageUrl("");
      setSelectedCategory("");
      setNewCategoryName("");
      setNewCategoryImageUrl("");

      navigate("/admin");
    }
  }, [category]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (newCategoryName && newCategoryImageUrl) {
      const createdCategory: Category = {
        id: "123",
        category: newCategoryName,
        imageUrl: newCategoryImageUrl,
      };
      dispatch(addcategoryAsync(createdCategory));
    } else if (selectedCategory) {
      dispatch(setActiveCategory(selectedCategory));
    }
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log("KATEGORIER: ", categories);
  });

  return (
    <Paper
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {productToEdit ? "Redigera produkt" : "Lägg till ny produkt"}
      </Typography>

      <form onSubmit={handleOnSubmit} style={{ width: "100%", maxWidth: 600 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Namn"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Beskrivning"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Pris"
            variant="outlined"
            fullWidth
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <TextField
            label="Bild URL"
            variant="outlined"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <TextField
            label="Antal"
            variant="outlined"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <TextField
            label="Rabatt"
            variant="outlined"
            fullWidth
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />

          <FormControl fullWidth>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Kategori"
            >
              {categories.map((cat: Category) => (
                <MenuItem key={cat.id} value={cat.category}>
                  <Typography sx={{ color: "black", fontSize: 14 }}>
                    {cat.category}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCategory === "" && (
            <>
              <Typography>Ny kategori</Typography>
              <TextField
                label="Kategorinamn"
                variant="outlined"
                fullWidth
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <TextField
                label="Kategoribild"
                variant="outlined"
                fullWidth
                value={newCategoryImageUrl}
                onChange={(e) => setNewCategoryImageUrl(e.target.value)}
              />
            </>
          )}

          <Box mt={3} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" color="primary">
              {productToEdit ? "Spara ändringar" : "Lägg till produkt"}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
}
