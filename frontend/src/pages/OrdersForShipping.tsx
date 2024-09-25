import { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { fetchAllOrdersAsync, Order } from "../slices/orderSlice"; // Justera import
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function OrdersForShipping() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orderSlice.orders); // Uppdatera baserat på din state
  const [shippingOrders, setShippingOrders] = useState<Order[]>([]);
  const [pickupOrders, setPickupOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const result = await dispatch(fetchAllOrdersAsync());
    console.log(result); // Logga resultatet för att se vad som hämtas
  };
  

  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(fetchAllOrdersAsync());
    };
    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      const shipping = orders.filter((order: Order) => order.shippingMethod === 'shipping' && order.status !== 'Paid');
      const pickup = orders.filter((order: Order) => order.shippingMethod === 'pickup' && order.status !== 'Paid');
      setShippingOrders(shipping);
      setPickupOrders(pickup);
    }
  }, [orders]);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Ordrar för Frakt
      </Typography>
      <List>
        {shippingOrders.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()).map((order: Order) => (
          <ListItem key={order.id}>
            <ListItemText 
              primary={`Order ID: ${order.id}`} 
              secondary={`Kund: ${order.guestFirstName}`} 
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h4" gutterBottom>
        Ordrar för Upphämtning
      </Typography>
      <List>
        {pickupOrders.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()).map((order: Order) => (
          <ListItem key={order.id}>
            <ListItemText 
              primary={`Order ID: ${order.id}`} 
              secondary={`Kund: ${order.guestFirstName}`} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
