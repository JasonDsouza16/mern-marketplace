import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";

export const TransactionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateOrderStatus = async () => {
      const query = new URLSearchParams(location.search);
      const sessionId = query.get("session_id");

      try {
        await axios.post(
          "http://localhost:4000/api/orders/update-success-order-status",
          { sessionId }
        );
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    };

    updateOrderStatus();
  }, [location.search]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Transaction Successful
      </Typography>
      <Typography variant="body1" paragraph>
        Thank you for your purchase! Your order has been placed successfully.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </Container>
  );
};
