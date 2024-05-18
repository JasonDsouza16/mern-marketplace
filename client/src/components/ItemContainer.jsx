import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardMedia, Grid, Typography, Container, Button } from '@mui/material';

export const ItemContainer = () => {
  const [items, setItems] = useState([]);
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleAddToCart = async (productId, userEmail) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        'http://localhost:4000/api/orders',
        { productId: productId,
          userEmail: userEmail,
          quantity: 30
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Item added to cart:', response.data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        All products
      </Typography>
      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.image || 'default-image.jpg'} // Provide a default image if none
                alt={item.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Price: Rs.{item.price}
                </Typography>
                {isAuthenticated && (
          <Button variant="contained" color="primary" onClick={()=>handleAddToCart(item._id, user.email)}>
            Add to Cart
          </Button>
        )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
