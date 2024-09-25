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
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import ProductPreview from "../components/ProductPreview";
import {
  addcategoryAsync,
  Category,
  getCategorysAsync,
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
  const products = useAppSelector((state) => state.productSlice.products);
  const categories = useAppSelector((state) => state.categorySlice.categorys);
  const productToEdit = products.find((p) => p.id === param);

  const isNewProductMode = param === "ny";

  const [name, setName] = useState(productToEdit ? productToEdit.name : "");
  const [description, setDescription] = useState(
    productToEdit ? productToEdit.description : ""
  );
  const [price, setPrice] = useState(productToEdit ? productToEdit.price : "");

  const [amount, setAmount] = useState(
    productToEdit ? productToEdit.amount : ""
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    productToEdit ? productToEdit.imageUrl : null
  );

  const [discount, setDiscount] = useState(
    productToEdit ? productToEdit.discount : ""
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    productToEdit
      ? categories.find((c) => c.id === productToEdit.categoryId) || null
      : null
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    dispatch(getCategorysAsync());
  }, [dispatch]);

  const handleOnSubmit = async (
    e: MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (newCategoryName && newCategoryImageUrl) {
      const newCategory: Category = {
        id: "tempId",
        category: newCategoryName,
        imageUrl: newCategoryImageUrl,
      };
      await dispatch(addcategoryAsync(newCategory));
    }

    const categoryId = selectedCategory ? selectedCategory.id : newCategoryName;
    if (imageUrl && price && amount) {
      const product: Product = {
        id: productToEdit ? productToEdit.id : "default",
        name,
        description,
        price: Number(price),
        imageUrl,
        amount: Number(amount),
        categoryId,
        discount: Number(discount),
        // launch_date: new Date().toISOString(),
        vat_amount: 25,
      };

      if (productToEdit) {
        await dispatch(updateProductAsync(product));
      } else if (isNewProductMode) {
        await dispatch(addProductAsync(product));
      }
      navigate("/admin");
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory && !newCategoryName) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

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
      <form
        // onSubmit={handleOnSubmit}
        style={{
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {productToEdit ? "Redigera produkt" : "Lägg till ny produkt"}
        </Typography>
        {!preview && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: 1,
            }}
          >
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
              onChange={(e) => setPrice(e.target.value)}
            />

            <ImageUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />

            <TextField
              label="Antal"
              variant="outlined"
              fullWidth
              type="number"
              value={amount}
              sx={{
                "& input[type=number]": {
                  "-moz-appearance": "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                  {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
              }}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              label="Rabatt"
              variant="outlined"
              fullWidth
              type="number"
              value={discount}
              sx={{
                "& input[type=number]": {
                  "-moz-appearance": "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                  {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
              }}
              onChange={(e) => setDiscount(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedCategory?.id || ""}
                onChange={(e) => {
                  const selected = categories.find(
                    (cat) => cat.id === e.target.value
                  );
                  setSelectedCategory(selected || null);
                }}
                label="Kategori"
              >
                {categories.map((cat: Category) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Typography sx={{ color: "black", fontSize: 14 }}>
                      {cat.category}
                    </Typography>
                  </MenuItem>
                ))}
                <MenuItem value="">
                  <em>Ny kategori</em>
                </MenuItem>
              </Select>
            </FormControl>

            {selectedCategory == null && (
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
              <Button
                onClick={() => setPreview(true)}
                variant="contained"
                color="primary"
              >
                <Typography>{"Förhandsgrandska"}</Typography>
              </Button>
            </Box>
          </Box>
        )}
        {preview && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <ProductPreview
              name={name}
              description={description}
              imageUrl={imageUrl}
              price={price}
            />
            <Box mt={3} display="flex" justifyContent="center" sx={{ gap: 2 }}>
              <Button
                onClick={(e) => handleOnSubmit(e)}
                variant="contained"
                color="primary"
              >
                {productToEdit ? "Spara ändringar" : "Lägg till produkt"}
              </Button>
              <Button
                onClick={() => setPreview(false)}
                variant="contained"
                color="primary"
              >
                Tillbaka
              </Button>
            </Box>
          </Box>
        )}
      </form>
    </Paper>
  );
}
