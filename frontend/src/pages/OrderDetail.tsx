import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Order } from "../slices/orderSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orderSlice.orders);
  const products = useAppSelector((state) => state.productSlice.products);
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    if (orders) {
      const foundOrder = orders.find((o) => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  //LÄS HÄR NEDAN ANGELINA

  const handleCancelPayment = () => {
    // if (order) {
    //   //HÄMTA INCOMINGPAYMENTORDER FÖR ATT HÄMTA PAYMENTINO OCH SEN DETTA:
    //   const operation = paymentInfo.operations.find((o) => o.rel === "capture");
    //   if (operation && operation.href) {
    //     dispatch(
    //       makeCancelRequest({ cancelRequest: {}, cancelUrl: operation.href })
    //     );
    //   } else {
    //     console.error("No valid operation found to cancel the payment.");
    //   }
    // }
  };

  const handleRevokePayment = () => {};

  const handleShippingOrder = () => {
    // Logic to mark orders as shipped
  };

  const handlePickupOrder = () => {
    // Logic to mark orders as picked up
  };

  if (!order) {
    return <Typography variant="h6">Order not found.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" p={2}>
      <Typography variant="h4" gutterBottom>
        Order Details: {order.id}
      </Typography>

      <Box mb={2}>
        <Typography variant="body1">
          <strong>Kund:</strong> {order.guestFirstName} {order.guestLastName}
        </Typography>
        <Typography variant="body1">
          <strong>Telefon:</strong> {order.guestPhone}
        </Typography>
        <Typography variant="body1">
          <strong>E-post:</strong> {order.guestEmail}
        </Typography>
      </Box>

      <ListSubheader>Produkter:</ListSubheader>
      <List>
        {order.items &&
          order.items.map((item) => {
            const product = products.find((p) => p.id === item.product_id);
            return (
              <ListItem key={item.id}>
                <ListItemText
                  primary={`${
                    product ? product.name : "Produkt okänd"
                  } (Antal: ${item.quantity})`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Pris: {item.price / 100} SEK
                      </Typography>
                      <Typography variant="body2">
                        Total summa: {(item.quantity * item.price) / 100} kr
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
      </List>

      <Box display="flex" justifyContent="space-between" mt="auto" p={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCancelPayment}
        >
          Avbryt betalning
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRevokePayment}
        >
          Återkalla betalning
        </Button>
        <Button variant="contained" color="primary" onClick={handlePickupOrder}>
          Order hämtad
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleShippingOrder}
        >
          Order skickad
        </Button>
      </Box>
    </Box>
  );
}
