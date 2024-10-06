// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { PaymentOrderOutgoing } from "../../types";
// import { generatePayeeReference } from "../../utils";
// import SeamlessCheckout from "../components/SeamlessCheckout";
// import { Order, updateOrderAsync, updateOrderFrakt } from "../slices/orderSlice";
// import { addPaymentOrderOutgoing } from "../slices/paymentSlice";
// import { Product } from "../slices/productSlice";
// import { useAppDispatch, useAppSelector } from "../slices/store";

// export default function Checkout() {
//   const incomingPaymentOrder = useAppSelector(
//     (state) => state.paymentSlice.paymentOrderIncoming
//   );
//   const order = useAppSelector((state) => state.orderSlice.order);
//   const products = useAppSelector((state) => state.productSlice.products);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const [isOrderUpdated, setIsOrderUpdated] = useState(false);
//   const dispatch = useAppDispatch();

//   const [isPickup, setIsPickup] = useState(false);
//   const [isShipping, setIsShipping] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [street, setStreet] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [city, setCity] = useState("");
//   const [shippingError, setShippingError] = useState(false);
//   const [totalShippingCost, setTotalShippingCost] = useState(0);
//   const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);

//   const handleShippingMethodChange = (method: string) => {
//     setSelectedShippingMethod(method);
//     if (order) { // Ensure order is not null
//       dispatch(updateOrderFrakt([order, products])); // Dispatch here
//     }
//   };

//   const handleAddToOrder = async () => {
//     setEmailError(false);
//     setShippingError(false);

//     if (order && firstName && lastName && phone && email) {
//       const emailIsValid = email.includes("@") && email.includes(".");

//       if (emailIsValid) {
//         setEmailError(false);

//         const fullShippingAddress = isShipping
//           ? `${street}, ${postalCode}, ${city}`
//           : "";

//         const updatedOrder: Order = {
//           ...order,
//           guestFirstName: firstName,
//           guestLastName: lastName,
//           guestEmail: email,
//           guestPhone: phone,
//           shippingMethod: isShipping ? "shipping" : "pickup",
//           shippingAddress: isShipping ? fullShippingAddress : "",
//           shippingCost: isShipping ? totalShippingCost : 0, // Använd beräknad fraktkostnad
//         };

//         dispatch(updateOrderAsync(updatedOrder)); // Uppdatera ordern
//         setIsOrderUpdated(true); // Markera order som uppdaterad
//       } else {
//         setEmailError(true); // Visa felmeddelande om email är ogiltig
//       }

//       if (isShipping && (!street || !postalCode || !city)) {
//         setShippingError(true);
//       }
//     }
//   };

//   useEffect(() => {
//     if (
//       order &&
//       order.guestFirstName &&
//       order.guestLastName &&
//       order.guestPhone &&
//       order.guestEmail &&
//       (order.shippingMethod === "pickup" ||
//         (order.shippingMethod === "shipping" && order.shippingAddress))
//     ) {
//       setIsOrderUpdated(true);
//     }
//   }, [order]);

//   const handleMakeOrder = () => {
//     if (order) {

//       const payeeId = import.meta.env.VITE_SWEDBANK_PAYEEID;
//       const payeeName = import.meta.env.VITE_SWEDBANK_PAYEENAME;
//       const paymentOrder: PaymentOrderOutgoing = {
//         operation: "Purchase",
//         currency: "SEK",
//         // amount: order.total_amount,
//         amount: order.total_amount,
//         vatAmount: order.vat_amount,
//         description: "Test Purchase",
//         userAgent: "Mozilla/5.0...",
//         language: "sv-SE",
//         urls: {
//           hostUrls: ["https://localhost:5173/checkout"], //Seamless View only
//           paymentUrl: "https://localhost:5173/checkout", //Seamless View only
//           completeUrl: "https://localhost:5173/confirmation",
//           cancelUrl: "https://localhost:5173/checkout", //Redirect only
//           callbackUrl:
//             "https://swedbankpay-gad0dfg6fha9bpfh.swedencentral-01.azurewebsites.net/swedbankpay/callbackDenthu",
//           logoUrl: "", //Redirect only
//         },
//         payeeInfo: {
//           payeeId: payeeId,
//           payeeReference: generatePayeeReference(true),
//           payeeName: payeeName,
//           orderReference: order.reference,
//         },
//       };
//       if (isShipping) {
//         // Om frakt krävs, capture sker senare via admin
//         // dispatch(someAdminActionToCaptureLater());
//       } else {
//         // Capture sker som vanligt om det inte är frakt
//         dispatch(addPaymentOrderOutgoing(paymentOrder));
//       }
//       // dispatch(addPaymentOrderOutgoing(paymentOrder));
//       // dispatch(clearCart());
//     }
//   };

//   function getProduct(productId: string): Product | undefined {
//     return products.find((p) => p.id == productId);
//   }

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         margin: "0 auto",
//         padding: "20px",
//         display: "flex",
//         flexDirection: "row",
//         borderRadius: "10px",
//         boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <Box sx={{ display: "flex", flexDirection: "column", flex: 1 / 2 }}>
//       {order && order.total_amount && (
//   <Typography variant="h6" sx={{ marginBottom: 2 }}>
//     Totalbelopp: {((order.total_amount / 100) + (isShipping ? totalShippingCost : 0))} kr inkl. moms
//   </Typography>
// )}

//         {products &&
//           order &&
//           order.items.map((item) => {
//             const product = getProduct(item.product_id);
//             return (
//               <Box
//                 key={item.product_id}
//                 sx={{
//                   backgroundColor: "white",
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   alignItems: "center",
//                   padding: 1,
//                   marginY: 4,
//                   borderRadius: "8px",
//                   boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
//                   marginX: 2,
//                 }}
//               >
//                 <img
//                   src={product?.imageUrl}
//                   alt={product?.name}
//                   style={{
//                     height: 100,
//                     width: 80,
//                     objectFit: "cover",
//                     borderRadius: "4px",
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     paddingX: { xs: 2, sm: 4 },
//                     width: "100%",
//                     textAlign: { xs: "center", sm: "left" },
//                     marginBottom: { xs: 1, sm: 0 },
//                   }}
//                 >
//                   <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
//                     {product?.name}
//                   </Typography>
//                   <Typography sx={{ fontSize: 16, color: "#555" }}>
//                     Antal: {item.quantity}
//                   </Typography>
//                   <Typography
//                   sx={{
//                     marginLeft: "auto",
//                     fontSize: 18,
//                     fontWeight: 600,
//                   }}
//                 >
//                   {(item.price * item.quantity) / 100} kr
//                 </Typography>
//                   <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
//                     Totalt: {(item.price * item.quantity) / 100
//                     }kr
//                   </Typography>
//                 </Box>

//               </Box>
//             );
//           })}
//                             <Typography sx={{ fontSize: 16, color: "#555" }}>
//                     Fraktkostnad: {order?.shippingCost} kr
//                   </Typography>
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           flex: 1,
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{ fontWeight: 600, marginBottom: 3, textAlign: "center" }}
//         >
//           Betalning
//         </Typography>
//         {incomingPaymentOrder && incomingPaymentOrder.operations && (
//           <SeamlessCheckout />
//         )}
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <TextField
//             label="Förnamn"
//             variant="outlined"
//             fullWidth
//             onChange={(event) => setFirstName(event.target.value)}
//           />
//           <TextField
//             label="Efternamn"
//             variant="outlined"
//             fullWidth
//             onChange={(event) => setLastName(event.target.value)}
//           />
//         </Box>
//         <Box sx={{ display: "flex", gap: 1 }}>
//           {emailError && (
//             <Typography sx={{ color: "red" }}>
//               Vänligen fyll i en giltig emailadress
//             </Typography>
//           )}
//           <TextField
//             label="Email"
//             variant="outlined"
//             fullWidth
//             onChange={(event) => setEmail(event.target.value)}
//           />
//           <TextField
//             label="Telefon"
//             variant="outlined"
//             fullWidth
//             onChange={(event) => setPhone(event.target.value)}
//           />
//         </Box>

//         {/* Checkboxar för fraktalternativ */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 1,
//             marginTop: 2,
//           }}
//         >
//       <FormControlLabel
//   control={
//     <Checkbox
//       checked={isPickup}
//       onChange={(e) => {
//         setIsPickup(e.target.checked);
//         setIsShipping(false);
//         handleShippingMethodChange("pickup"); // Call this to update order when pickup is selected
//       }}
//     />
//   }
//   label="Hämta på plats"
// />
// <FormControlLabel
//   control={
//     <Checkbox
//       checked={isShipping}
//       onChange={(e) => {
//         setIsShipping(e.target.checked);
//         setIsPickup(false);
//         handleShippingMethodChange("shipping"); // Call this to update order when shipping is selected
//       }}
//     />
//   }
//   label="Leverans"
// />
//         {/* Leveransadressfält om frakt har valts */}
//         {isShipping && (
//           <Box>
//             <TextField
//               label="Gata"
//               variant="outlined"
//               fullWidth
//               value={street}
//               onChange={(event) => setStreet(event.target.value)}
//               sx={{ marginTop: 2 }}
//               error={shippingError && !street}
//               helperText={shippingError && !street ? "Fyll i gata" : ""}
//             />
//             <TextField
//               label="Postnummer"
//               variant="outlined"
//               fullWidth
//               value={postalCode}
//               onChange={(event) => setPostalCode(event.target.value)}
//               sx={{ marginTop: 2 }}
//               error={shippingError && !postalCode}
//               helperText={shippingError && !postalCode ? "Fyll i postnummer" : ""}
//             />
//             <TextField
//               label="Ort"
//               variant="outlined"
//               fullWidth
//               value={city}
//               onChange={(event) => setCity(event.target.value)}
//               sx={{ marginTop: 2 }}
//               error={shippingError && !city}
//               helperText={shippingError && !city ? "Fyll i ort" : ""}
//             />
//           </Box>
//         )}

// {isOrderUpdated ? (
//           <>
//             <Button
//               onClick={handleMakeOrder}
//               fullWidth
//               sx={{
//                 padding: "14px",
//                 backgroundColor: "#1976d2",
//                 color: "white",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 textTransform: "none",
//                 marginTop: 3,
//                 "&:hover": {
//                   backgroundColor: "#1565c0",
//                 },
//               }}
//             >
//               Gå till betalning
//             </Button>

//             {/* Visa SeamlessCheckout-vyn endast när order är uppdaterad */}
//             {incomingPaymentOrder && incomingPaymentOrder.operations && (
//               <SeamlessCheckout />
//             )}
//           </>
//         ) : (
//           <Button
//             onClick={handleAddToOrder}
//             fullWidth
//             sx={{
//               padding: "14px",
//               backgroundColor: "#1976d2",
//               color: "white",
//               fontSize: "16px",
//               fontWeight: "bold",
//               textTransform: "none",
//               marginTop: 3,
//               "&:hover": {
//                 backgroundColor: "#1565c0",
//               },
//             }}
//           >
//             Fortsätt
//           </Button>
//         )}
//       </Box>
//     </Box>
//   );
// }

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
  const [totalShippingCost, setTotalShippingCost] = useState(0);
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
          productsRemoved.push(productInOrder);
          setProductsRemoved([...productsRemoved]);

          if (o.quantity > productInOrder.amount) {
            return {
              ...o,
              quantity: productInOrder.amount,
            };
          }
          if (productInOrder.amount === 0) {
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
    }
  }, [order, products]);

  const handleShippingMethodChange = (method: string) => {
    setSelectedShippingMethod(method);
    if (order) {
      dispatch(updateOrderFrakt([order, products, method]));
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
          shippingCost: isShipping ? totalShippingCost : 0,
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
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Totalbelopp:{" "}
            {order.total_amount / 100 + (isShipping ? totalShippingCost : 0)} kr
            inkl. moms
          </Typography>
        )}

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
        <Typography sx={{ fontSize: 16, color: "#555" }}>
          Fraktkostnad: {order?.shippingCost} kr
        </Typography>
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
