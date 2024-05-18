import React from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

export const CheckoutButton = ({ userEmail }) => {
  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/orders/create-payment-intent', { userEmail });
      const { id } = response.data;

      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error('Stripe Checkout error:', error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <button onClick={handleCheckout}>
      Checkout
    </button>
  );
};

