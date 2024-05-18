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

export const Cart = () => {
  const [order, setOrder] = useState(null);
  const { user, isLoading } = useAuth0();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/userCart/${user.email}`
        );
        setOrder(response.data);
        console.log(order);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [isLoading]);

  const handleIncrement = () => {};

  const handleDecrement = () => {};

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Typography variant="h4" gutterBottom>
            Shopping Cart
          </Typography>
          {order ? (
            <Box>
              <List>
                {order.items.map((item) => (
                  <ListItem key={item._id}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Price: Rs.${item.price}, Quantity: ${item.quantity}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="add"
                        onClick={() => handleIncrement(item._id)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => handleDecrement(item._id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6">
                Grand Total: Rs.{order.grandTotal}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1">Your cart is empty.</Typography>
          )}
        </Container>
      )}
    </>
  );
};
