import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Container, Box, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth0 } from "@auth0/auth0-react";
import Loader from '../components/Loader';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user, getAccessTokenSilently, isLoading } = useAuth0();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getAccessTokenSilently();

        const response = await axios.get(
          `http://localhost:4000/api/orders/my-orders/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (!isLoading) {
      fetchOrders();
    }
  }, [isLoading, getAccessTokenSilently, user]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Typography variant="h4" gutterBottom>
            My Orders
          </Typography>
          {orders.map((order) => (
            <Accordion key={order._id} sx={{ marginBottom: '1rem' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order ID:
                    </Typography>
                    <Typography variant="body2">
                      {order._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Status:
                    </Typography>
                    <Typography variant="body2">
                      {order.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order Date:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Grand Total:
                    </Typography>
                    <Typography variant="body2">
                      ₹{order.orderGrandTotal}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Items:</Typography>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id} style={{ marginBottom: '0.5rem' }}>
                        <Box>
                          <Typography variant="body2">
                            <strong>Item:</strong> {item.item.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantity:</strong> {item.quantity}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Price:</strong> ₹{item.item.price}
                          </Typography>
                        </Box>
                      </li>
                    ))}
                  </ul>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      )}
    </>
  );
};
