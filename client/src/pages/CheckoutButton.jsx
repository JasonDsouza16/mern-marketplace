import React from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@mui/material";

export const CheckoutButton = ({ userEmail }) => {
  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orders/create-payment-intent`,
        { userEmail }
      );
      const { id } = response.data;

      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error("Stripe Checkout error:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <Button onClick={handleCheckout} sx={{ border: "1px solid black" }}>
      Checkout
    </Button>
  );
};
