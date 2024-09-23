import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { Product } from "../../data/types";
import TableMUI from "../components/TableMUIComponent";
import { logOutUserAsync } from "../slices/adminSlice";
import { getProductsAsync, Product } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";
// import { useProductContext } from "../contexts/ProductContext";
// import { useAppDispatch } from "../store/store";
// import { logOutUserAsync } from "../store/userSlice";

export default function AdminProducts() {
  const navigate = useNavigate();
  const products = useAppSelector((state) => state.productSlice.products);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useAppDispatch();

  function handleAction(product: Product) {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  }

  function handleRemoveProduct() {
    setIsPopupOpen(false);
  }

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);

  const handleLogOut = () => {
    dispatch(logOutUserAsync());
    navigate("/");
  };

  const titleRows = ["Produkt", "Id", "Titel", "Pris", "Radera", "Redigera "];

  const productRows = products.map((p) => [
    {
      property: <img src={p.imageUrl} alt="Product" width="20" height="20" />,
      datacyCell: "",
    },
    { property: p.id, datacyCell: "product-id" },
    { property: p.name, datacyCell: "product-title" },
    { property: p.price, datacyCell: "product-price" },
    {
      property: (
        <Button
          variant="contained"
          data-cy="admin-remove-product"
          sx={{
            backgroundColor: "black",
            fontSize: "10px",
            "&:hover": {
              backgroundColor: "grey",
            },
          }}
          onClick={() => handleAction(p)}
        >
          Radera
        </Button>
      ),
      datacyCell: " ",
    },
    {
      property: (
        <Button
          variant="contained"
          data-cy="admin-edit-product"
          sx={{
            backgroundColor: "black",
            fontSize: "10px",
            "&:hover": {
              backgroundColor: "grey",
            },
          }}
          onClick={() => navigate(`/admin/product/${p.id}`)}
        >
          Redigera
        </Button>
      ),
      datacyCell: " ",
    },
  ]);

  return (
    <Box display={"flex"} flex={1} flexDirection={"column"} width={"100%"}>
      <Box
        my={2}
        display={"flex"}
        flexDirection={"row"}
        width={"100%"}
        justifyContent={"space-between"}
      >
        <NavLink to="/admin/product/ny" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#009688",
              "&:hover": {
                backgroundColor: "#00695c",
              },
            }}
            data-cy="admin-add-product"
          >
            Lägg till produkt
          </Button>
        </NavLink>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#009688",
            "&:hover": {
              backgroundColor: "#00695c",
            },
          }}
          onClick={handleLogOut}
        >
          Logga ut
        </Button>
      </Box>

      <TableMUI
        titleRow={titleRows}
        cellRows={productRows}
        datacy="product"
        data-cy="product-form"
      />

      <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent sx={{ display: "flex" }}>
          {selectedProduct && (
            <Box>
              <p>ID: {selectedProduct.id}</p>
              <p>Title: {selectedProduct.name}</p>
              <p>Description: {selectedProduct.description}</p>
              <p>Price: {selectedProduct.price}</p>
              {
                <Button
                  variant="contained"
                  data-cy="confirm-delete-button"
                  color="primary"
                  onClick={() => handleRemoveProduct()}
                >
                  Ta bort
                </Button>
              }
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
