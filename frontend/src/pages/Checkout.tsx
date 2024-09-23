import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PaymentOrderOutgoing } from "../../types";
import { generatePayeeReference } from "../../utils";
import SeamlessCheckout from "../components/SeamlessCheckout";
import { Order, updateOrderAsync } from "../slices/orderSlice";
import { addPaymentOrderOutgoing } from "../slices/paymentSlice";
import { Product } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function Checkout() {
  const incomingPaymentOrder = useAppSelector(
    (state) => state.paymentSlice.paymentOrderIncoming
  );
  const order = useAppSelector((state) => state.orderSlice.order);
  const products = useAppSelector((state) => state.productSlice.products);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const dispatch = useAppDispatch();

  const [isPickup, setIsPickup] = useState(false);
  const [isShipping, setIsShipping] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingError, setShippingError] = useState(false);
  const [totalShippingCost, setTotalShippingCost] = useState(0);

  const handleAddToOrder = async () => {
    setEmailError(false);
    setShippingError(false);

    if (order && firstName && lastName && phone && email) {
      const emailIsValid = email.includes("@") && email.includes(".");
      if (emailIsValid) {
        setEmailError(false);
        const updatedOrder: Order = {
          ...order,
          guestFirstName: firstName,
          guestLastName: lastName,
          guestEmail: email,
          guestPhone: phone,
          shippingMethod: isShipping ? "shipping" : "pickup",
          shippingAddress: isShipping ? shippingAddress : "",
          shippingCost: isShipping ? 50 * 100 : 0, // Exempel fraktkostnad
        };
        dispatch(updateOrderAsync(updatedOrder));
      } else {
        setEmailError(true);
      }
      if (isShipping && !shippingAddress) {
        setShippingError(true);
      }
    }
  };

  useEffect(() => {
    if (order && isShipping) {
      const shippingCost = order.items.reduce((total, item) => {
        const product = getProduct(item.product_id);
        return total + getProductShippingCost(product);
      }, 0);
      setTotalShippingCost(shippingCost);
    } else {
      setTotalShippingCost(0);
    }
  }, [order, isShipping, products]);

  useEffect(() => {
    if (
      order &&
      order.guestFirstName &&
      order.guestLastName &&
      order.guestPhone &&
      order.guestEmail &&
      (order.shippingMethod === "pickup" ||
        (order.shippingMethod === "shipping" && order.shippingAddress))
    ) {
      setIsOrderUpdated(true);
    }
  }, [order]);

  function getProductShippingCost(product: Product | undefined): number {
    // Kolla om produkten har fraktalternativ och välj ett rimligt alternativ
    if (product && product.shippingOptions.length > 0) {
      // Anta att vi tar det första fraktalternativet för enkelhetens skull
      return product.shippingOptions[0].cost;
    }
    return 0; // Om ingen frakt finns, returnera 0
  }

  const handleMakeOrder = () => {
    if (order) {
      const totalShippingCost = isShipping
      ? order.items.reduce((total, item) => {
          const product = getProduct(item.product_id);
          return total + getProductShippingCost(product); // Calculate total shipping cost
        }, 0)
      : 0;

    // Do not divide totalShippingCost by 100
    const totalAmount = order.total_amount + totalShippingCost;

      const payeeId = import.meta.env.VITE_SWEDBANK_PAYEEID;
      const payeeName = import.meta.env.VITE_SWEDBANK_PAYEENAME;
      const paymentOrder: PaymentOrderOutgoing = {
        operation: "Purchase",
        currency: "SEK",
        // amount: order.total_amount,
        amount: totalAmount,
        vatAmount: order.vat_amount,
        description: "Test Purchase",
        userAgent: "Mozilla/5.0...",
        language: "sv-SE",
        urls: {
          hostUrls: ["https://localhost:5173/checkout"], //Seamless View only
          paymentUrl: "https://localhost:5173/checkout", //Seamless View only
          completeUrl: "https://localhost:5173/confirmation",
          cancelUrl: "https://localhost:5173/checkout", //Redirect only
          callbackUrl:
            "https://swedbankpay-gad0dfg6fha9bpfh.swedencentral-01.azurewebsites.net/swedbankpay/callback/denthu",
          logoUrl: "", //Redirect only
        },
        payeeInfo: {
          payeeId: payeeId,
          payeeReference: generatePayeeReference(true),
          payeeName: payeeName,
          orderReference: order.reference,
        },
      };
      if (isShipping) {
        // Om frakt krävs, capture sker senare via admin
        // dispatch(someAdminActionToCaptureLater());
      } else {
        // Capture sker som vanligt om det inte är frakt
        dispatch(addPaymentOrderOutgoing(paymentOrder));
      }
      // dispatch(addPaymentOrderOutgoing(paymentOrder));
      // dispatch(clearCart());
    }
  };

  function getProduct(productId: string): Product | undefined {
    return products.find((p) => p.id == productId);
  }

  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "row",
        borderRadius: "10px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 / 2 }}>
      {order && order.total_amount && (
  <Typography variant="h6" sx={{ marginBottom: 2 }}>
    Totalbelopp: {((order.total_amount / 100) + (isShipping ? totalShippingCost : 0))} kr inkl. moms
  </Typography>
)}

        {products &&
          order &&
          order.items.map((item) => {
            const product = getProduct(item.product_id);
            const productShippingCost = isShipping
              ? getProductShippingCost(product)
              : 0;
            return (
              <Box
                key={item.product_id}
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  padding: 1,
                  marginY: 4,
                  borderRadius: "8px",
                  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
                  marginX: 2,
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
                  <Typography
                  sx={{
                    marginLeft: "auto",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {(item.price * item.quantity) / 100} kr
                </Typography>
                  <Typography sx={{ fontSize: 16, color: "#555" }}>
                    Fraktkostnad: {productShippingCost} kr
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    Totalt: {(item.price * item.quantity) / 100 +
                      productShippingCost}{" "}
                    kr
                  </Typography>
                </Box>
              
              </Box>
            );
          })}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, marginBottom: 3, textAlign: "center" }}
        >
          Betalning
        </Typography>
        {incomingPaymentOrder && incomingPaymentOrder.operations && (
          <SeamlessCheckout />
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
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
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {emailError && (
            <Typography sx={{ color: "red" }}>
              Vänligen fyll i en giltig emailadress
            </Typography>
          )}
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

        {/* Checkboxar för fraktalternativ */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            marginTop: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isPickup}
                onChange={(event) => {
                  setIsPickup(event.target.checked);
                  setIsShipping(false); // Avmarkera frakt om upphämtning väljs
                }}
              />
            }
            label="Hämta upp på plats"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isShipping}
                onChange={(event) => {
                  setIsShipping(event.target.checked);
                  setIsPickup(false); // Avmarkera upphämtning om frakt väljs
                }}
              />
            }
            label="Skicka med frakt (50 kr)"
          />
        </Box>

        {/* Leveransadressfält om frakt har valts */}
        {isShipping && (
          <TextField
            label="Leveransadress"
            variant="outlined"
            fullWidth
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            sx={{ marginTop: 2 }}
            error={shippingError}
            helperText={
              shippingError ? "Vänligen fyll i en leveransadress" : ""
            }
          />
        )}

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
    </Box>
  );
}
