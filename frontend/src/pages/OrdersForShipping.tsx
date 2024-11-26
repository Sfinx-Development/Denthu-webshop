import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllOrdersAsync, Order } from "../slices/orderSlice";
import { getProductsAsync } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function OrdersForShipping() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orderSlice.orders);
  const products = useAppSelector((state) => state.productSlice.products);
  const [shippingOrders, setShippingOrders] = useState<Order[]>([]);
  const [pickupOrders, setPickupOrders] = useState<Order[]>([]);
  const [handledOrders, setHandledOrders] = useState<Order[]>([]);
  const [showHandledOrders, setShowHandledOrders] = useState(false);
  const [showReversedOrders, setShowReversedOrders] = useState(false);
  const [showCancelledOrders, setShowCancelledOrders] = useState(false);
  const [cancelledOrder, setCancelledOrders] = useState<Order[]>([]);
  const [reversedOrder, setReversedOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductsAsync());
    dispatch(fetchAllOrdersAsync());
  }, []);

  useEffect(() => {
    if (orders) {
      const shipping = orders.filter(
        (order) =>
          order.shippingMethod == "shipping" &&
          !order.isShipped &&
          order.status != "Waiting for payment" &&
          order.status != "Reversed" &&
          order.status != "Cancelled"
      );
      const pickup = orders.filter(
        (order) =>
          order.shippingMethod == "pickup" &&
          !order.isPickedUp &&
          order.status != "Waiting for payment" &&
          order.status != "Reversed" &&
          order.status != "Cancelled"
      );
      const handled = orders.filter(
        (order) =>
          order.isShipped ||
          (order.isPickedUp &&
            order.status != "Waiting for payment" &&
            order.status != "Reversed" &&
            order.status != "Cancelled")
      );

      const cancelled = orders.filter((order) => order.status == "Cancelled");
      const reversed = orders.filter((order) => order.status == "Reversed");

      setShippingOrders(shipping);
      setPickupOrders(pickup);
      setHandledOrders(handled);
      setCancelledOrders(cancelled);
      setReversedOrders(reversed);
    }
  }, [orders]);

  const handleFetchHandledOrders = () => {
    setShowHandledOrders((prev) => !prev);
  };

  const handleFetchCancelledOrders = () => {
    setShowCancelledOrders((prev) => !prev);
  };

  const handleFetchReversedOrders = () => {
    setShowReversedOrders((prev) => !prev);
  };

  return (
    <Box display="flex" flexDirection="column" p={2}>
      <Typography variant="h3" textAlign="center" gutterBottom>
        Orderhantering
      </Typography>
      {orders && (
        <Grid container spacing={4}>
          {/* Reusable Component for Order Sections */}
          {[
            {
              title: "Ordrar för frakt",
              orders: shippingOrders,
              emptyMessage: "Inga ordrar för frakt.",
            },
            {
              title: "Ordrar för upphämtning",
              orders: pickupOrders,
              emptyMessage: "Inga ordrar för upphämtning.",
            },
            {
              title: "Hanterade Ordrar",
              orders: showHandledOrders ? handledOrders : [],
              emptyMessage: "Inga hanterade ordrar hittades.",
              actionButton: (
                <Button
                  onClick={handleFetchHandledOrders}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  {showHandledOrders
                    ? "Dölj Hanterade Ordrar"
                    : "Visa Hanterade Ordrar"}
                </Button>
              ),
            },
            {
              title: "Avbrytna Ordrar",
              orders: showCancelledOrders ? cancelledOrder : [],
              emptyMessage: "Inga avbrytna ordrar hittades.",
              actionButton: (
                <Button
                  onClick={handleFetchCancelledOrders}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  {showCancelledOrders
                    ? "Dölj Avbrytna Ordrar"
                    : "Visa Avbrytna Ordrar"}
                </Button>
              ),
            },
            {
              title: "Återkallade Betalningar/Ordrar",
              orders: showReversedOrders ? reversedOrder : [],
              emptyMessage: "Inga återkallade ordrar hittades.",
              actionButton: (
                <Button
                  onClick={handleFetchReversedOrders}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  {showReversedOrders
                    ? "Dölj Återkallade Ordrar"
                    : "Visa Återkallade Ordrar"}
                </Button>
              ),
            },
          ].map((section, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardHeader title={section.title} />
                <CardContent>
                  {section.actionButton}
                  {section.orders.length > 0 ? (
                    section.orders
                      .sort(
                        (a, b) =>
                          new Date(b.created_date).getTime() -
                          new Date(a.created_date).getTime()
                      )
                      .map((order) => (
                        <Card
                          key={order.id}
                          variant="outlined"
                          sx={{
                            marginBottom: 2,
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                            },
                          }}
                          onClick={() =>
                            navigate(`/admin/orderdetail/${order.id}`)
                          }
                        >
                          <CardContent>
                            <Typography variant="h6">
                              Orderdatum:{" "}
                              {new Date(
                                order.created_date
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Kund: {order.guestFirstName} {order.guestLastName}
                            </Typography>
                            <Typography variant="body2">
                              Telefon: {order.guestPhone}
                            </Typography>
                            <Typography variant="body2">
                              E-post: {order.guestEmail}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              Totalt: {order.total_amount / 100} kr
                            </Typography>
                            <Typography variant="body2" marginTop={1}>
                              <strong>Produkter:</strong>
                            </Typography>
                            <List>
                              {order.items.map((item) => {
                                const product = products.find(
                                  (p) => p.id === item.product_id
                                );
                                return (
                                  <ListItem
                                    key={item.id}
                                    disablePadding
                                    sx={{ paddingY: 0.5 }}
                                  >
                                    <Typography variant="body2">
                                      {product ? product.name : "Produkt okänd"}{" "}
                                      (x{item.quantity})
                                    </Typography>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <Typography variant="body1">
                      {section.emptyMessage}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
