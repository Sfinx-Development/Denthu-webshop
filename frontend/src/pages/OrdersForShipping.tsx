import {
  Box,
  Button,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
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
  const [shippingOrders, setShippingOrders] = useState<Order[]>([]);
  const [pickupOrders, setPickupOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<{
    [key: string]: boolean;
  }>({});
  const products = useAppSelector((state) => state.productSlice.products);

  useEffect(() => {
    dispatch(getProductsAsync());
    dispatch(fetchAllOrdersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      const shipping = orders.filter(
        (order) =>
          order.shippingMethod === "shipping" && order.status !== "Paid"
      );
      const pickup = orders.filter(
        (order) => order.shippingMethod === "pickup" && order.status !== "Paid"
      );
      setShippingOrders(shipping);
      setPickupOrders(pickup);
    }
  }, [orders]);

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrders((prevSelected) => ({
      ...prevSelected,
      [orderId]: !prevSelected[orderId],
    }));
  };

  const handleShippingOrder = () => {
    // Logic to mark orders as shipped
  };

  const handlePickupOrder = () => {
    // Logic to mark orders as picked up
  };

  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} p={2} overflow="auto">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Ordrar för frakt
            </Typography>
            <List>
              {shippingOrders
                .sort(
                  (a, b) =>
                    new Date(b.created_date).getTime() -
                    new Date(a.created_date).getTime()
                )
                .map((order) => (
                  <ListItem
                    key={order.id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={!!selectedOrders[order.id]}
                        onChange={() => handleCheckboxChange(order.id)}
                      />
                    }
                  >
                    <ListItemText
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/orderdetail/${order.id}`)}
                      primary={`Order ID: ${order.id}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Kund: {order.guestFirstName} {order.guestLastName}
                          </Typography>
                          <Typography variant="body2">
                            Telefon: {order.guestPhone}
                          </Typography>
                          <Typography variant="body2">
                            E-post: {order.guestEmail}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListSubheader>Produkter:</ListSubheader>
                    <List>
                      {order.items &&
                        order.items.map((item) => {
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
                  </ListItem>
                ))}
            </List>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Ordrar för upphämtning
            </Typography>
            <List>
              {pickupOrders
                .sort(
                  (a, b) =>
                    new Date(b.created_date).getTime() -
                    new Date(a.created_date).getTime()
                )
                .map((order) => (
                  <ListItem
                    key={order.id}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/admin/orderdetail/${order.id}`)}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={!!selectedOrders[order.id]}
                        onChange={() => handleCheckboxChange(order.id)}
                      />
                    }
                  >
                    <ListItemText
                      primary={`Order ID: ${order.id}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Kund: {order.guestFirstName} {order.guestLastName}
                          </Typography>
                          <Typography variant="body2">
                            Telefon: {order.guestPhone}
                          </Typography>
                          <Typography variant="body2">
                            E-post: {order.guestEmail}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListSubheader>Produkter:</ListSubheader>
                    <List>
                      {order.items &&
                        order.items.map((item) => {
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
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </Box>

      {/* Fixed Action Buttons at the Bottom */}
      <Box display="flex" justifyContent="space-between" p={2}>
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
