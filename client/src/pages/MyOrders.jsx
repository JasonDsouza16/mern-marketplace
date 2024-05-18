import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Container } from '@mui/material';
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
            `http://localhost:4000/api/orders/api/my-orders/${user.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
    //     const response = await axios.get(`http://localhost:4000/api/orders/api/my-orders/${user.email}`),
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [isLoading]);

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
        <Accordion key={order._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`Order ID: ${order._id}`}</Typography>
            <Typography>{`Status: ${order.status}`}</Typography>
            <Typography>{`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1">Items:</Typography>
            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  <Typography>{`Item: ${item.name}`}</Typography>
                  <Typography>{`Quantity: ${item.quantity}`}</Typography>
                  <Typography>{`Price: ${item.price}`}</Typography>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
          )}
          </>
  );
};

