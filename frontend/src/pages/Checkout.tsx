import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Order, updateOrderAsync } from "../slices/orderSlice";
import { Product } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function Checkout() {
  const order = useAppSelector((state) => state.orderSlice.order);
  const products = useAppSelector((state) => state.productSlice.products);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddToOrder = () => {
    if (order && firstName && lastName && phone && email) {
      const updatedOrder: Order = {
        ...order,
        guestFirstName: firstName,
        guestLastName: lastName,
        guestEmail: email,
        guestPhone: phone,
      };
      dispatch(updateOrderAsync(updatedOrder));
    }
  };

  useEffect(() => {
    if (
      order?.guestFirstName &&
      order?.guestLastName &&
      order?.guestPhone &&
      order?.guestEmail
    ) {
      setIsOrderUpdated(true);
    }
  }, [order]);

  const handleMakeOrder = () => {
    // Logik för att genomföra order
  };

  function getProduct(productId: string): Product | undefined {
    return products.find((p) => p.id === productId);
  }

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, marginBottom: 3, textAlign: "center" }}
      >
        Kassa
      </Typography>

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Totalbelopp: {order?.total_amount} kr
      </Typography>

      {order?.items.map((item) => {
        const product = getProduct(item.product_id);
        return (
          <Box
            key={item.product_id}
            sx={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              padding: 2,
              marginBottom: 2,
              borderRadius: "8px",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <img
              src={product?.imageUrl}
              alt={product?.name}
              style={{
                height: 100,
                width: 80,
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <Box
              sx={{
                paddingX: { xs: 2, sm: 4 },
                width: "100%",
                textAlign: { xs: "center", sm: "left" },
                marginBottom: { xs: 1, sm: 0 },
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                {product?.name}
              </Typography>
              <Typography sx={{ fontSize: 16, color: "#555" }}>
                Antal: {item.quantity}
              </Typography>
            </Box>
            <Typography
              sx={{
                marginLeft: "auto",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {item.price * item.quantity} kr
            </Typography>
          </Box>
        );
      })}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Förnamn"
          variant="outlined"
          fullWidth
          onChange={(event) => setFirstName(event.target.value)}
        />
        <TextField
          label="Efternamn"
          variant="outlined"
          fullWidth
          onChange={(event) => setLastName(event.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Telefon"
          variant="outlined"
          fullWidth
          onChange={(event) => setPhone(event.target.value)}
        />
      </Box>

      {isOrderUpdated ? (
        <Button
          onClick={handleMakeOrder}
          fullWidth
          sx={{
            padding: "14px",
            backgroundColor: "#1976d2",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
            marginTop: 3,
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Gå till betalning
        </Button>
      ) : (
        <Button
          onClick={handleAddToOrder}
          fullWidth
          sx={{
            padding: "14px",
            backgroundColor: "#1976d2",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
            marginTop: 3,
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Fortsätt
        </Button>
      )}
    </Box>
  );
}
