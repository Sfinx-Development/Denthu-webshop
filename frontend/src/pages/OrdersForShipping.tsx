import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
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
  
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductsAsync());
    dispatch(fetchAllOrdersAsync());
  }, []);

  useEffect(() => {
    if (Array.isArray(orders)) {
      const shipping = orders.filter(
        (order) =>
          order.shippingMethod == "shipping" &&
          !order.isShipped &&
          order.status != "Waiting for payment"
      );
      const pickup = orders.filter(
        (order) =>
          order.shippingMethod == "pickup" &&
          !order.isPickedUp &&
          order.status != "Waiting for payment"
      );
      const handled = orders.filter(
        (order) =>
          order.isShipped ||
          (order.isPickedUp && order.status != "Waiting for payment")
      );

      setShippingOrders(shipping);
      setPickupOrders(pickup);
      setHandledOrders(handled);
    }
  }, [orders]);

  const handleFetchHandledOrders = () => {
    setShowHandledOrders((prev) => !prev); 
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" p={2}>
      <Typography variant="h3" gutterBottom>
        Orderhantering
      </Typography>
      <Grid container spacing={4}>
        {/* Shipping Orders Section */}
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardHeader title="Ordrar för frakt" />
            <CardContent>
              {!shippingOrders ? (
                <Typography variant="body1">Inga ordrar för frakt.</Typography>
              ) : (
                shippingOrders
                  .sort(
                    (a, b) =>
                      new Date(b.created_date).getTime() -
                      new Date(a.created_date).getTime()
                  )
                  .map((order) => (
                    <Card
                      key={order.id}
                      variant="outlined"
                      sx={{ marginBottom: 2 }}
                    >
                      <CardContent
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/admin/orderdetail/${order.id}`)
                        }
                      >
                        <Typography variant="h6">
                          {new Date(order.created_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Kund: {order.guestFirstName} {order.guestLastName}
                        </Typography>
                        <Typography variant="body2">
                          Telefon: {order.guestPhone}
                        </Typography>
                        <Typography variant="body2">
                          E-post: {order.guestEmail}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Totalt belopp: {order.total_amount / 100} kr
                        </Typography>
                        <List sx={{ padding: 0 }}>
                          <Typography>Produkter:</Typography>
                          {order.items.map((item) => {
                            const product = products.find(
                              (p) => p.id === item.product_id
                            );
                            return (
                              <ListItem key={item.id} sx={{ padding: 0 }}>
                                <Typography>
                                  {product ? product.name : "Produkt okänd"} (
                                  {item.quantity} st)
                                </Typography>
                              </ListItem>
                            );
                          })}
                        </List>
                      </CardContent>
                    </Card>
                  ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pickup Orders Section */}
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardHeader title="Ordrar för upphämtning" />
            <CardContent>
              {!pickupOrders ? (
                <Typography variant="body1">
                  Inga ordrar för upphämtning.
                </Typography>
              ) : (
                pickupOrders
                  .sort(
                    (a, b) =>
                      new Date(b.created_date).getTime() -
                      new Date(a.created_date).getTime()
                  )
                  .map((order) => (
                    <Card
                      key={order.id}
                      variant="outlined"
                      sx={{ marginBottom: 2 }}
                    >
                      <CardContent
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/admin/orderdetail/${order.id}`)
                        }
                      >
                        <Typography variant="h6">
                          Order ID: {order.id}
                        </Typography>
                        <Typography variant="body2">
                          Kund: {order.guestFirstName} {order.guestLastName}
                        </Typography>
                        <Typography variant="body2">
                          Telefon: {order.guestPhone}
                        </Typography>
                        <Typography variant="body2">
                          E-post: {order.guestEmail}
                        </Typography>
                        <List>
                          {order.items.map((item) => {
                            const product = products.find(
                              (p) => p.id === item.product_id
                            );
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
                                        Total summa:{" "}
                                        {(item.quantity * item.price) / 100} kr
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      </CardContent>
                    </Card>
                  ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Handled Orders Section */}
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardHeader title="Hanterade Ordrar" />
            <CardContent>
              <Button
                onClick={handleFetchHandledOrders}
                variant="contained"
                color="primary"
                sx={{ marginBottom: 2 }}
              >
                {showHandledOrders
                  ? "Dölj Hanterade Ordrar"
                  : "Visa Hanterade Ordrar"}
              </Button>
              <List>
                {showHandledOrders && handledOrders.length > 0
                  ? handledOrders
                      .sort(
                        (a, b) =>
                          new Date(b.created_date).getTime() -
                          new Date(a.created_date).getTime()
                      )
                      .map((order) => (
                        <Card
                          key={order.id}
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                        >
                          <CardContent
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/admin/orderdetail/${order.id}`)
                            }
                          >
                            <Typography variant="h6">
                              Order ID: {order.id}
                            </Typography>
                            <Typography variant="body2">
                              Kund: {order.guestFirstName} {order.guestLastName}
                            </Typography>
                            <Typography variant="body2">
                              Telefon: {order.guestPhone}
                            </Typography>
                            <Typography variant="body2">
                              E-post: {order.guestEmail}
                            </Typography>
                            <List>
                              {order.items.map((item) => {
                                const product = products.find(
                                  (p) => p.id === item.product_id
                                );
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
                                            Total summa:{" "}
                                            {(item.quantity * item.price) / 100}{" "}
                                            kr
                                          </Typography>
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
                          </CardContent>
                        </Card>
                      ))
                  : showHandledOrders && (
                      <Typography variant="body2">
                        Inga hanterade ordrar hittades.
                      </Typography>
                    )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
