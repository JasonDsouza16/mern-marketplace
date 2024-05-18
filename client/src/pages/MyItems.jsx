import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardMedia, Grid, Typography, Container } from '@mui/material';

export const MyItems = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.get(`http://localhost:4000/api/items/userEmail/${user.email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setItems(response.data);
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      }
    };

    fetchItems();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  if (!isAuthenticated) {
    return <Typography variant="h5">Please log in to view your products.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Products
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
