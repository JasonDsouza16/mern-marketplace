import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../components/Loader";
import { CheckoutButton } from "./CheckoutButton";

export const Cart = () => {
  const [order, setOrder] = useState(null);
  const { user, isLoading, getAccessTokenSilently } = useAuth0();

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/userCart/${user.email}`
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchOrder();
    }
  }, [isLoading]);

  const handleIncrement = async (productId, userEmail) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orders`,
        {
          productId: productId,
          userEmail: userEmail,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrder();
      console.log("Item added to cart:", response.data);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleDecrement = async (productId, userEmail) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orders`,
        {
          productId: productId,
          userEmail: userEmail,
          quantity: -1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrder();
      console.log("Item removed from cart:", response.data);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Typography variant="h4" gutterBottom>
            Shopping Cart
          </Typography>
          {order && order.items.length > 0 ? (
            <Box>
              <List>
                {order.items.map((item) => (
                  <ListItem sx={{ border: "1px solid" }} key={item._id}>
                    <ListItemText
                      primary={item.item.name}
                      secondary={`Price: Rs.${item.item.price}, Quantity: ${item.quantity}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() =>
                          handleDecrement(item.item._id, user.email)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="add"
                        onClick={() =>
                          handleIncrement(item.item._id, user.email)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6">
                Grand Total: Rs.{order.orderGrandTotal}
              </Typography>
              <CheckoutButton userEmail={user.email} />
            </Box>
          ) : (
            <Typography variant="body1">Your cart is empty.</Typography>
          )}
        </Container>
      )}
    </>
  );
};
