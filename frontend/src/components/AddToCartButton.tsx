import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Product } from "../slices/productSlice";
import { useAppDispatch } from "../slices/store";
import { addToCart } from "../slices/cartSlice";

interface Props {
  product: Product;
}

const AddtoCartButton: React.FC<Props> = ({ product }) => {
  const [productAddedToCart, setProductAddedToCart] = useState(false);
  const [resetButton, setResetButton] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (resetButton) {
      setProductAddedToCart(false);
    }
  }, [resetButton]);

  const handleAddToCart = () => {
    if (!productAddedToCart) {
      dispatch(addToCart(product));
      setProductAddedToCart(true);
      setTimeout(() => {
        setResetButton(true);
        setTimeout(() => {
          setResetButton(false);
        });
      }, 3000);
    }
  };

  if (product.amount <= 0) {
    return null; 
  }

  return (
    <div>
      <Button
        onClick={handleAddToCart}
        variant="contained"
        disabled={productAddedToCart || resetButton}
        sx={{
          mt: 1,
          mb: 1,
          background: "#000",
          color: "#fff",
          "&:hover": {
            backgroundColor: "black",
            transform: "scale(1.05)",
            transition: "transform 0.2s ease-in-out",
          },
        }}
      >
        <ShoppingCartIcon fontSize="small" style={{ marginRight: "8px" }} />
        {productAddedToCart ? (
          <Typography variant="body1">har lagts till</Typography>
        ) : (
          <Typography variant="body1">Lägg till</Typography>
        )}
      </Button>
    </div>
  );
};

export default AddtoCartButton;
