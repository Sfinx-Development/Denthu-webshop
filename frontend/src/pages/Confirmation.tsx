import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import emailjs from "emailjs-com";
import { useEffect } from "react";
import {
  sendNewOrderNotificationToDenthu,
  sendOrderConfirmationWithLink,
} from "../emailTemplates";
import { clearCart } from "../slices/cartSlice";
import { Order, setEmailSent, updateOrderAsync } from "../slices/orderSlice";
import {
  clearCallbackData,
  clearCapture,
  clearPaymentInfo,
  clearPaymentOrder,
  getPaymentPaidValidation,
} from "../slices/paymentSlice";
import { Product, updateProductAsync } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function Confirmation() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const order = useAppSelector((state) => state.orderSlice.order);
  const products = useAppSelector((state) => state.productSlice.products);
  const paymentInfo = useAppSelector((state) => state.paymentSlice.paymentInfo);
  const callbacks = useAppSelector((state) => state.paymentSlice.callbackData);
  const emailSent = useAppSelector((state) => state.orderSlice.emailSent);
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };
  const incomingPaymentOrder = useAppSelector(
    (state) => state.paymentSlice.paymentOrderIncoming
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (incomingPaymentOrder) {
      dispatch(getPaymentPaidValidation(incomingPaymentOrder));
    }
  }, []);

  useEffect(() => {
    if (order) {
      dispatch(clearCart());
    }
  }, []);

  useEffect(() => {
    if (paymentInfo && order) {
      const orderUpdatedPayment: Order = {
        ...order,
        status:
          order.paymentInfo?.instrument == "Swish"
            ? "Paid"
            : "Paid/Not captured",
        paymentInfo: paymentInfo.paymentOrder.paid,
      };
      dispatch(updateOrderAsync(orderUpdatedPayment));
      order.items.forEach((o) => {
        const productToUpdate = products.find((p) => p.id == o.product_id);
        if (productToUpdate) {
          const product: Product = {
            ...productToUpdate,
            amount: productToUpdate.amount - o.quantity,
          };
          dispatch(updateProductAsync(product));
        }
      });
    }
  }, [paymentInfo]);

  useEffect(() => {
    if (paymentInfo && order && callbacks) {
      const orderUpdatedPayment: Order = {
        ...order,
        status: "Paid/Not Captured",
        paymentInfo: paymentInfo.paymentOrder.paid,
      };
      dispatch(updateOrderAsync(orderUpdatedPayment));
    }
  }, [paymentInfo, callbacks]);

  useEffect(() => {
    if (
      (order && paymentInfo?.paymentOrder.status == "Paid") ||
      (paymentInfo?.paymentOrder.status == "Paid/Not Captured" &&
        emailSent == false &&
        order)
    ) {
      sendOrderConfirmationWithLink(order, products);
      sendNewOrderNotificationToDenthu(order, products);
      dispatch(setEmailSent(true));
      dispatch(clearCart());
      dispatch(clearPaymentInfo());
      // dispatch(clearOrder());
      dispatch(clearPaymentOrder());
      dispatch(clearCapture());
      dispatch(clearCallbackData());
      localStorage.removeItem("isShipping");
    }
  }, [order]);

  useEffect(() => {
    // När sidan har laddats och order är visad
    return () => {
      localStorage.removeItem("currentOrder");
    };
  }, []);

  emailjs.init("C8CxNnxZg6mg-d2tq");

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
      }}
    >
      <Box sx={{ flex: 1, padding: 2 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
          Tack för ditt köp!
        </Typography>
        <Typography>
          Dina varor är nu reserverade och redo att hämtas på DenThu
          skadeverkstad.
        </Typography>
        <Typography>
          Om du har betalat med kort dras inte pengarna förrän ordern är hämtad.
        </Typography>
        <Typography sx={{ paddingY: 2 }}>
          Vi skickar ett mail med en orderbekräftelse till {order?.guestEmail}.
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.05)",
          padding: 2,
          display: "flex",
          borderRadius: 2,
          marginX: 1,
          flexDirection: "column",
          marginTop: isSmallScreen ? 2 : 0,
        }}
      >
        <Typography
          sx={{ fontSize: 20, fontWeight: 600, marginBottom: 2, paddingX: 2 }}
        >
          Ordersummering
        </Typography>
        <Box
          sx={{
            flex: 1,
            paddingX: 2,
            paddingY: 1,
            display: "flex",
            gap: 3,
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Betalningsmetod</Typography>
            <Typography>{order?.paymentInfo?.instrument}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Datum för order</Typography>
            <Typography>{order?.created_date}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Ordernummer</Typography>
            <Typography>{order?.reference}</Typography>
          </Box>
        </Box>
        <Box sx={{ padding: 2 }}>
          {order?.items.map((item) => {
            const product = getProduct(item.product_id); // Fetch the product details
            return (
              <Box
                key={item.product_id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  height: 80,
                  marginBottom: 2,
                }}
              >
                <img
                  src={product?.imageUrl || "https://i.imgur.com/FNo0BUN.jpeg"}
                  alt={product?.name || "Product Image"}
                  height="80"
                  style={{ borderRadius: 10 }}
                />
                <Box sx={{ height: "100%", flexGrow: 1 }}>
                  <Typography
                    sx={{ fontSize: 16, marginX: 2, fontWeight: 600 }}
                  >
                    {product?.name || "Produktnamnet"}{" "}
                  </Typography>
                  <Typography sx={{ fontSize: 14, marginX: 2 }}>
                    Pris per produkt: {item.price / 100} kr{" "}
                  </Typography>
                  <Typography sx={{ fontSize: 14, marginX: 2 }}>
                    Antal: {item.quantity} st
                  </Typography>
                </Box>
                <Box sx={{ height: "100%" }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      marginX: 2,
                      fontWeight: 600,
                      justifyContent: "start",
                    }}
                  >
                    {(item.price / 100) * item.quantity} kr
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {order && (
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Totalt belopp</Typography>
              <Typography>{order.total_amount / 100} kr</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
