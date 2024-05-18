import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

export const TransactionFail = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Transaction Failed
      </Typography>
      <Typography variant="body1" paragraph>
        Unfortunately, your transaction could not be completed. Please try again.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Container>
  );
};

