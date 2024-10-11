import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PaymentOrderOutgoing } from "../../types";
import { generatePayeeReference } from "../../utils";
import SeamlessCheckout from "../components/SeamlessCheckout";
import {
  Order,
  OrderItem,
  updateOrderAsync,
  updateOrderFrakt,
} from "../slices/orderSlice";
import { addPaymentOrderOutgoing } from "../slices/paymentSlice";
import { getProductsAsync, Product } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";
import { OrderItemType } from "../../swedbankTypes";

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
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [shippingError, setShippingError] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<
    string | null
  >(null);
  const [productsRemoved, setProductsRemoved] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);

  useEffect(() => {
    //kolla om produkterna (order items) och antalen fortfarande finns i lager
    //annars gråmarkera dessa och uppdatera ordern - text slut i lager
    //och uppdatera paymentorder till swedbank
    if (order) {
      const updatedItems = order.items.map((o) => {
        const productInOrder = products.find((p) => p.id === o.product_id);

        if (productInOrder) {
          if (o.quantity > productInOrder.amount) {
            if (productsRemoved.find((p) => p.id != productInOrder.id)) {
              productsRemoved.push(productInOrder);
              setProductsRemoved([productInOrder, ...productsRemoved]);
            }
            return {
              ...o,
              quantity: productInOrder.amount,
            };
          }
          if (productInOrder.amount === 0) {
            if (productsRemoved.find((p) => p.id != productInOrder.id)) {
              productsRemoved.push(productInOrder);
              setProductsRemoved([productInOrder, ...productsRemoved]);
            }

            return null;
          }
        }
        return o;
      });

      const filteredItems: OrderItem[] = updatedItems.filter(
        (item): item is OrderItem => item !== null
      );

      const updatedOrder: Order = {
        ...order,
        items: filteredItems,
      };

      dispatch(updateOrderAsync(updatedOrder));
      //och uppdatera CART med items.
      //vad göra med dom som tog slut i lager under tiden? spara med boolean slut i lager?
    }
  }, [products, dispatch]);

  const handleShippingMethodChange = (method: string) => {
    setSelectedShippingMethod(method);
    if (order) {
      if(method == "pickup"){
        dispatch(updateOrderAsync(order));
      }else{
        dispatch(updateOrderFrakt([order, products, method]));
      }
    }
  };

  const handleAddToOrder = async () => {
    setEmailError(false);
    setShippingError(false);

    if (order && firstName && lastName && phone && email) {
      const emailIsValid = email.includes("@") && email.includes(".");

      if (emailIsValid) {
        setEmailError(false);

        const fullShippingAddress = isShipping
          ? `${street}, ${postalCode}, ${city}`
          : "";

        const updatedOrder: Order = {
          ...order,
          guestFirstName: firstName,
          guestLastName: lastName,
          guestEmail: email,
          guestPhone: phone,
          shippingMethod: isShipping ? "shipping" : "pickup",
          shippingAddress: isShipping ? fullShippingAddress : "",
          shippingCost: isShipping ? order.shippingCost : 0,
        };

        dispatch(updateOrderAsync(updatedOrder));
        setIsOrderUpdated(true);
      } else {
        setEmailError(true);
      }

      if (isShipping && (!street || !postalCode || !city)) {
        setShippingError(true);
      }
    }
  };

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

  useEffect(() => {
    if (order && incomingPaymentOrder) {
      const updatedOrder: Order = {
        ...order,
        incomingPaymentOrderId: incomingPaymentOrder.id,
      };
      dispatch(updateOrderAsync(updatedOrder));
    }
  }, [incomingPaymentOrder]);

  const handleMakeOrder = () => {
    //göra denna asyjc?
    handleAddToOrder();
    if (order && !shippingError && !emailError) {
      const payeeId = import.meta.env.VITE_SWEDBANK_PAYEEID;
      const payeeName = import.meta.env.VITE_SWEDBANK_PAYEENAME;
      const paymentOrder: PaymentOrderOutgoing = {
        operation: "Purchase",
        currency: "SEK",
        amount: order.total_amount,
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
            "https://swedbankpay-gad0dfg6fha9bpfh.swedencentral-01.azurewebsites.net/swedbankpay/callbackDenthu",
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
        dispatch(addPaymentOrderOutgoing(paymentOrder));
      } else {
        // Capture sker som vanligt om det inte är frakt
        dispatch(addPaymentOrderOutgoing(paymentOrder));
      }
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
          <>
            <Typography variant="h6">
              Totalbelopp:{" "}
              {order.total_amount/100}{" "}
              kr
            </Typography>
            <Typography sx={{ fontSize: 14, marginBottom: "" }}>
              Inkl. moms
            </Typography>
          </>
        )}
        {/* /hejsan hoppsan */}

        {products &&
          order &&
          order.items.map((item) => {
            const product = getProduct(item.product_id);
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
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    Totalt: {(item.price * item.quantity) / 100} kr
                  </Typography>
                </Box>
              </Box>
            );
          })}
           {isShipping && 
        <Typography sx={{ fontSize: 16, color: "#555" }}>
         Fraktkostnad: {order?.shippingCost} kr
        </Typography>}
        {productsRemoved &&
          productsRemoved.map((item) => {
            return (
              <Box>
                <Typography>Produkter som är slut i lager</Typography>
                <Box
                  key={item.id}
                  sx={{
                    backgroundColor: "lightgrey",
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
                    src={item?.imageUrl}
                    alt={item?.name}
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
                      {item?.name}
                    </Typography>
                  </Box>
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
        <TextField
          label="Telefonnummer"
          variant="outlined"
          fullWidth
          onChange={(event) => setPhone(event.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          error={emailError}
          helperText={emailError ? "Ogiltig e-postadress" : ""}
          onChange={(event) => setEmail(event.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPickup}
              onChange={(event) => {
                setIsPickup(event.target.checked);
                setIsShipping(false);
                handleShippingMethodChange("pickup");
              }}
            />
          }
          label="Hämta upp"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isShipping}
              onChange={(event) => {
                setIsShipping(event.target.checked);
                setIsPickup(false);
                handleShippingMethodChange("shipping");
              }}
            />
          }
          label="Leverans"
        />
        {isShipping && (
          <>
            <TextField
              label="Gata"
              variant="outlined"
              fullWidth
              error={shippingError && !street}
              onChange={(event) => setStreet(event.target.value)}
            />
            <TextField
              label="Postnummer"
              variant="outlined"
              fullWidth
              error={shippingError && !postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
            />
            <TextField
              label="Stad"
              variant="outlined"
              fullWidth
              error={shippingError && !city}
              onChange={(event) => setCity(event.target.value)}
            />
          </>
        )}
        {/* <Button
          variant="contained"
          onClick={handleAddToOrder}
          sx={{ marginTop: 2 }}
        >
          Fortsätt
        </Button> */}
        <Button
          variant="contained"
          onClick={() => handleMakeOrder()}
          sx={{ marginTop: 2 }}
        >
          Till betalning
        </Button>
      </Box>
    </Box>
  );
}
