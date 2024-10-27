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
import {
  CancelRequestOutgoing,
  OutgoingTransaction,
} from "../../swedbankTypes";
import { Order, updateOrderAsync } from "../slices/orderSlice";
import {
  getPaymentOrderIncoming,
  getPaymentPaidValidation,
  makeCancelRequest,
  postCaptureToInternalApi,
} from "../slices/paymentSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orderSlice.orders);
  const products = useAppSelector((state) => state.productSlice.products);
  const incomingPaymentOrder = useAppSelector(
    (state) => state.paymentSlice.paymentOrderIncoming
  );
  const paymentInfo = useAppSelector((state) => state.paymentSlice.paymentInfo);
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    if (orders) {
      const foundOrder = orders.find((o) => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  useEffect(() => {
    if (order && order.incomingPaymentOrderId) {
      dispatch(getPaymentOrderIncoming(order.incomingPaymentOrderId));
    }
  }, [order]);

  useEffect(() => {
    if (incomingPaymentOrder) {
      dispatch(getPaymentPaidValidation(incomingPaymentOrder));
    }
  }, [incomingPaymentOrder]);

  const capturePayment = async () => {
    if (
      paymentInfo &&
      paymentInfo.paymentOrder.paid.instrument == "CreditCard" &&
      order &&
      order.paymentInfo
    ) {
      console.log("KOMMER NI  I CAPTURE");
      //OCH OMO INTE FRAKT ÄR ATT SKICKA
      const operation = paymentInfo.operations.find((o) => o.rel === "capture");
      if (operation) {
        const outgoingTransaction: OutgoingTransaction = {
          transaction: {
            description: new Date().toLocaleDateString(),
            amount: paymentInfo.paymentOrder.amount,
            vatAmount: paymentInfo.paymentOrder.vatAmount,
            payeeReference: order.paymentInfo.payeeReference,
            captureUrl: operation.href,
          },
        };
        dispatch(postCaptureToInternalApi(outgoingTransaction));
      }
    }
  };

  //LÄS HÄR NEDAN ANGELINA

  const handleCancelPayment = () => {
    //KOLLA FÖRST SÅ INTE DEN ÄR CAPTURED
    if (paymentInfo) {
      const operation = paymentInfo.operations.find((o) => o.rel == "cancel");
      if (operation && operation.href && order?.paymentInfo) {
        const cancelRequest: CancelRequestOutgoing = {
          description: "Test Cancellation",
          payeeReference: order.paymentInfo.payeeReference,
        };
        dispatch(
          makeCancelRequest({
            cancelRequest: cancelRequest,
            cancelUrl: operation.href,
          })
        );
      } else {
        console.error("No valid operation found to cancel the payment.");
      }
    }
  };

  const handleRevokePayment = () => {};

  const handleShippingOrder = async () => {
    await capturePayment().then(() => {
      if (order) {
        const updatedOrder: Order = {
          ...order,
          isShipped: true,
        };
        dispatch(updateOrderAsync(updatedOrder));
      }
    });
    //vi hämtar incomingpaymentorder som ordern har KLART
    //när incomingpaymentorder finns - så hämtar vi dess paymentinfo  KLART
    //när paymentinfo finns hämtar vi capture adressen
    //gör ett capture anrop
  };

  const handlePickupOrder = async () => {
    await capturePayment().then(() => {
      if (order) {
        const updatedOrder: Order = {
          ...order,
          isPickedUp: true,
        };
        dispatch(updateOrderAsync(updatedOrder));
      }
    });
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
        <Button
          variant="contained"
          color="primary"
          onClick={handlePickupOrder}
          disabled={order.shippingMethod != "pickup" || order.isPickedUp}
        >
          Order hämtad
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleShippingOrder}
          disabled={order.shippingMethod != "shipping" || order.isShipped}
        >
          Order skickad
        </Button>
      </Box>
    </Box>
  );
}
