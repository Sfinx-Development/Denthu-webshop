import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PaymentOrderOutgoing } from "../../swedbankTypes";
import { generatePayeeReference } from "../../utils";
import SeamlessCheckout from "../components/SeamlessCheckout";
import {
  Order,
  OrderItem,
  updateOrderAsync,
  updateOrderFrakt,
} from "../slices/orderSlice";
import {
  addPaymentOrderOutgoing,
  updatePaymentOrderOutgoing,
} from "../slices/paymentSlice";
import { getProductsAsync, Product } from "../slices/productSlice";
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
  const paymentInfo = useAppSelector((state) => state.paymentSlice.paymentInfo);
  const [isPickup, setIsPickup] = useState(false);
  const [isShipping, setIsShipping] = useState(
    localStorage.getItem("isShipping") ? true : false
  );
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [shippingError, setShippingError] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<
    string | null
  >(null);
  const [productsRemoved, setProductsRemoved] = useState<Product[]>([]);

  const [phoneError, setPhoneError] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [streetError, setStreetError] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^(\+46|0)(7[02369])(\d{7})$/;
  const postalCodePattern = /^\d{5}$/;
  const streetPattern = /^[A-Za-zåäöÅÄÖ\s'-]+(?:\s\d+[A-Za-z]?)?$/;

  const validateForm = () => {
    const emailIsValid = emailPattern.test(email);
    const phoneIsValid = phonePattern.test(phone);
    const postalCodeIsValid = postalCodePattern.test(postalCode);
    const streetIsValid = streetPattern.test(street);

    setEmailError(!emailIsValid);
    setPhoneError(!phoneIsValid);
    setPostalCodeError(isShipping && !postalCodeIsValid);
    setStreetError(isShipping && !streetIsValid);

    return (
      emailIsValid &&
      phoneIsValid &&
      (!isShipping || (postalCodeIsValid && streetIsValid && city))
    );
  };

  const isFormComplete = () => {
    if (isShipping) {
      return (
        firstName &&
        lastName &&
        phone &&
        email &&
        street &&
        postalCode &&
        city &&
        !emailError
      );
    }
    return firstName && lastName && phone && email && !emailError;
  };

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

      if (incomingPaymentOrder) {
        handleUpdateOrderToSwedbank();
      }

      //och uppdatera CART med items.
      //vad göra med dom som tog slut i lager under tiden? spara med boolean slut i lager?
    }
  }, [products, dispatch]);

  const handleShippingMethodChange = (method: string) => {
    setSelectedShippingMethod(method);
    localStorage.setItem(
      "selectedShippingMethod",
      JSON.stringify(selectedShippingMethod)
    );
    if (order) {
      if (method == "pickup") {
        dispatch(updateOrderAsync(order));
        if (incomingPaymentOrder) {
          handleUpdateOrderToSwedbank();
        }
      } else {
        dispatch(updateOrderFrakt([order, products, method]));
        if (incomingPaymentOrder) {
          handleUpdateOrderToSwedbank();
        }
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
      // if (isShipping) {
      //   dispatch(
      //     updateOrderFrakt([
      //       updatedOrder,
      //       products,
      //       selectedShippingMethod || "pickup",
      //     ])
      //   );
      // } else {
      dispatch(updateOrderAsync(updatedOrder));
      // }
    }
  }, [incomingPaymentOrder]);

  const handleMakeOrder = () => {
    //göra denna asyjc?
    if (validateForm()) {
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
            hostUrls: ["https://denthuwebshop.netlify.app/checkout"], //Seamless View only
            paymentUrl: "https://denthuwebshop.netlify.app/checkout", //Seamless View only
            completeUrl: "https://denthuwebshop.netlify.app/confirmation",
            cancelUrl: "https://denthuwebshop.netlify.app/checkout", //Redirect only
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
          dispatch(addPaymentOrderOutgoing(paymentOrder));
        } else {
          dispatch(addPaymentOrderOutgoing(paymentOrder));
        }
      }
    }
  };

  const handleUpdateOrderToSwedbank = () => {
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
          hostUrls: ["https://denthuwebshop.netlify.app/checkout"], //Seamless View only
          paymentUrl: "https://denthuwebshop.netlify.app/checkout", //Seamless View only
          completeUrl: "https://denthuwebshop.netlify.app/confirmation",
          cancelUrl: "https://denthuwebshop.netlify.app/checkout", //Redirect only
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
      const updateOrderUrl = paymentInfo?.operations.find(
        (o) => o.rel === "update-order"
      );

      if (isShipping && updateOrderUrl) {
        dispatch(
          updatePaymentOrderOutgoing({
            paymentOrder: paymentOrder,
            url: updateOrderUrl.href,
          })
        );
      } else if (isPickup && updateOrderUrl) {
        dispatch(
          updatePaymentOrderOutgoing({
            paymentOrder: paymentOrder,
            url: updateOrderUrl.href,
          })
        );
      }
    }
  };

  function getProduct(productId: string): Product | undefined {
    return products.find((p) => p.id == productId);
  }

  const handleBlur = (field: string) => {
    if (field === "email") setEmailError(!emailPattern.test(email));
    else if (field === "phone") setPhoneError(!phonePattern.test(phone));
    else if (field === "postalCode")
      setPostalCodeError(!postalCodePattern.test(postalCode));
    else if (field === "street") setStreetError(!streetPattern.test(street));
  };
  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: "10px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
        gap: { xs: 2, md: 4 },
      }}
    >
      {/* Vänster kolumn */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {order && order.total_amount && (
          <>
            <Typography variant="h6" textAlign={{ xs: "center", sm: "left" }}>
              Totalbelopp: {order.total_amount / 100} kr
            </Typography>
            <Typography
              sx={{ fontSize: 14, textAlign: { xs: "center", sm: "left" } }}
            >
              Inkl. moms
            </Typography>
          </>
        )}

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
                  padding: 2,
                  marginY: 2,
                  borderRadius: "8px",
                  // boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
                  gap: 2,
                }}
              >
                {/* <img
                  src={product?.imageUrl}
                  alt={product?.name}
                  style={{
                    height: "80px",
                    width: "80px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                /> */}
                <Box
                  sx={{
                    paddingX: { xs: 1, sm: 2 },
                    width: "100%",
                    textAlign: { xs: "left", sm: "left" },
                  }}
                >
                  <Typography
                    sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 600 }}
                  >
                    {product?.name}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "#555" }}>
                    Antal: {item.quantity}
                  </Typography>
                  <Typography
                    sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 600 }}
                  >
                    {(item.price * item.quantity) / 100} kr
                  </Typography>
                </Box>
              </Box>
            );
          })}

        {isShipping && (
          <Typography
            sx={{
              fontSize: 16,
              color: "#555",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Fraktkostnad: {order?.shippingCost} kr
          </Typography>
        )}
      </Box>

      {/* Höger kolumn */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center" }}>
          Betalning
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 400, textAlign: "center", marginBottom: 2 }}
        >
          Vi hanterar dina personuppgifter i enlighet med vår{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            integritetspolicy
          </a>
          .
        </Typography>
        {incomingPaymentOrder && incomingPaymentOrder.operations && (
          <SeamlessCheckout />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            label="Förnamn"
            variant="outlined"
            fullWidth
            error={!firstName}
            helperText={!firstName ? "Förnamn är obligatoriskt" : ""}
            onChange={(event) => setFirstName(event.target.value)}
            onBlur={() => handleBlur("firstName")}
          />
          <TextField
            label="Efternamn"
            variant="outlined"
            fullWidth
            error={!lastName}
            helperText={!lastName ? "Efternamn är obligatoriskt" : ""}
            onChange={(event) => setLastName(event.target.value)}
            onBlur={() => handleBlur("lastName")}
          />
        </Box>
        <TextField
          label="Telefonnummer"
          variant="outlined"
          fullWidth
          error={phoneError}
          helperText={phoneError ? "Ange ett giltigt svenskt mobilnummer" : ""}
          onChange={(event) => setPhone(event.target.value)}
          onBlur={() => handleBlur("phone")}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          error={emailError}
          helperText={emailError ? "Ange en giltig e-postadress" : ""}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => handleBlur("email")}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isPickup}
              onChange={(event) => {
                setIsPickup(event.target.checked);
                setIsShipping(false);
                localStorage.removeItem("isShipping");
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
                localStorage.setItem("isShipping", JSON.stringify("true"));
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
              error={streetError}
              helperText={
                streetError ? "Ange en giltig adress (t.ex. Storgatan 5)" : ""
              }
              onChange={(event) => setStreet(event.target.value)}
              onBlur={() => handleBlur("street")}
            />
            <TextField
              label="Postnummer"
              variant="outlined"
              fullWidth
              error={postalCodeError}
              helperText={
                postalCodeError ? "Ange ett giltigt postnummer (5 siffror)" : ""
              }
              onChange={(event) => setPostalCode(event.target.value)}
              onBlur={() => handleBlur("postalCode")}
            />
            <TextField
              label="Stad"
              variant="outlined"
              fullWidth
              error={!city}
              helperText={!city ? "Stad är obligatoriskt" : ""}
              onChange={(event) => setCity(event.target.value)}
              onBlur={() => handleBlur("city")}
            />
          </>
        )}
        <Button
          variant="contained"
          onClick={() => handleMakeOrder()}
          sx={{ marginTop: 2 }}
          disabled={!isFormComplete()}
        >
          Till betalning
        </Button>
      </Box>
    </Box>
  );
}
