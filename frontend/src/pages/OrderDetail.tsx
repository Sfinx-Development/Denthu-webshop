import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Snackbar,
  Typography,
} from "@mui/material";
import emailjs from "emailjs-com";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CancelRequestOutgoing,
  OutgoingTransaction,
  ReverseRequestOutgoing,
} from "../../swedbankTypes";
import {
  sendOrderCancelledWithLink,
  sendOrderConfirmationPickedUp,
  sendOrderConfirmationShipped,
  sendOrderReversedWithLink,
} from "../emailTemplates";
import {
  fetchAllOrdersAsync,
  Order,
  updateOrderAsync,
} from "../slices/orderSlice";
import {
  getPaymentOrderIncoming,
  getPaymentPaidValidation,
  makeCancelRequest,
  makeReverseRequest,
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
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRevokeDialog, setOpenRevokeDialog] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  emailjs.init("C8CxNnxZg6mg-d2tq");
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllOrdersAsync());
  }, []);

  useEffect(() => {
    if (orders && orderId) {
      const foundOrder = orders.find((o) => o.id == orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  useEffect(() => {
    const fetchPaymentOrder = async () => {
      if (order && order.incomingPaymentOrderId && !incomingPaymentOrder) {
        await dispatch(getPaymentOrderIncoming(order.incomingPaymentOrderId));
      }

      if (incomingPaymentOrder) {
        console.log("NU FINNS INCOMING PAYMENT ORDER, SKA HÄMTA PAID:");
        dispatch(getPaymentPaidValidation(incomingPaymentOrder));
      }
    };

    fetchPaymentOrder();
  }, [order, incomingPaymentOrder, dispatch]);

  // useEffect(() => {
  //   if (incomingPaymentOrder) {
  //     console.log("NU FINNS INCOMING PAYMENT ORDER, SKA HÄMTA PAID:");
  //     dispatch(getPaymentPaidValidation(incomingPaymentOrder));
  //   }
  // }, [incomingPaymentOrder]);

  const capturePayment = async () => {
    if (
      paymentInfo &&
      paymentInfo.paymentOrder.paid.instrument == "CreditCard" &&
      order &&
      order.paymentInfo
    ) {
      const operation = paymentInfo.operations.find((o) => o.rel === "capture");
      if (operation) {
        console.log("SKICKAR CPTURE");
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

  const handleCancelPayment = () => {
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
        sendOrderCancelledWithLink(order, products);
        setOpenCancelDialog(false);
        setSnackbarOpen(true);
        setSnackBarMessage("Ordern uppdateras som avbruten!");
        setTimeout(() => {
          navigate("/admin/ordersForShipping");
        }, 1500);
      }
    }
  };

  const handleRevokePayment = () => {
    if (paymentInfo) {
      const operation = paymentInfo.operations.find(
        (o) => o.rel === "reversal"
      );
      console.log("OPERATION: ", operation);
      if (operation && operation.href && order?.paymentInfo) {
        const reverseRequest: ReverseRequestOutgoing = {
          description: "Reversal of captured transaction",
          amount: paymentInfo.paymentOrder.amount,
          vatAmount: paymentInfo.paymentOrder.vatAmount,
          payeeReference: order.paymentInfo.payeeReference,
        };
        dispatch(
          makeReverseRequest({
            reverseRequest: reverseRequest,
            reverseUrl: operation.href,
          })
        );
        sendOrderReversedWithLink(order, products);
        setOpenRevokeDialog(false);
        setSnackbarOpen(true);
        setSnackBarMessage("Betalningen uppdateras som återkallad!");
        setTimeout(() => {
          navigate("/admin/ordersForShipping");
        }, 1500);
      }
    }
  };

  const handleShippingOrder = async () => {
    try {
      await capturePayment();
      if (order) {
        const updatedOrder: Order = {
          ...order,
          isShipped: true,
        };
        dispatch(updateOrderAsync(updatedOrder));

        sendOrderConfirmationShipped(updatedOrder, products);
        setSnackbarOpen(true);
        setSnackBarMessage("Ordern uppdateras som skickad!");
        setTimeout(() => {
          navigate("/admin/ordersForShipping");
        }, 1500);
      }
    } catch (error) {
      console.error("Error in capturePayment:", error);
    }
  };

  const handlePickupOrder = async () => {
    await capturePayment();

    if (order) {
      const updatedOrder: Order = {
        ...order,
        isPickedUp: true,
      };
      dispatch(updateOrderAsync(updatedOrder));
      sendOrderConfirmationPickedUp(updatedOrder, products);
      setSnackbarOpen(true);
      setSnackBarMessage("Ordern uppdateras som hämtad!");
      setTimeout(() => {
        navigate("/admin/ordersForShipping");
      }, 1500);
    }
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
                        Total summa: {order.total_amount / 100} kr
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
          onClick={() => setOpenCancelDialog(true)} // Open cancel confirmation dialog
        >
          Avbryt betalning
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenRevokeDialog(true)} // Open revoke confirmation dialog
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

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Bekräfta Avbokning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Är du säker på att du vill avbryta betalningen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} color="primary">
            Avbryt
          </Button>
          <Button onClick={handleCancelPayment} color="secondary">
            Avbryt betalning
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <Dialog
        open={openRevokeDialog}
        onClose={() => setOpenRevokeDialog(false)}
      >
        <DialogTitle>Bekräfta Återkallelse</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Är du säker på att du vill återkalla betalningen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRevokeDialog(false)} color="primary">
            Avbryt
          </Button>
          <Button onClick={() => handleRevokePayment()} color="secondary">
            Återkalla betalning
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        message={snackBarMessage}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}
