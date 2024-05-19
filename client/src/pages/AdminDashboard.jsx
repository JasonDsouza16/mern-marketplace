import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, Typography, Container, Grid, Card, CardContent, Button, CardMedia } from '@mui/material';

export const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    // Fetch items data from the API
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/items');
        setItems(response.data);
        setFilteredItems(response.data); // Initially, show all items
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  // Filter items based on status
  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => item.status === statusFilter);
      setFilteredItems(filtered);
    }
  }, [items, statusFilter]);

  // Function to handle status change (approve/disapprove)
  const handleStatusChange = (itemId, newStatus) => {
    // Update status in the backend
    // Then update the status locally
    const updatedItems = items.map(item => {
      if (item._id === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Tabs
        value={statusFilter}
        onChange={(event, newValue) => setStatusFilter(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="ALL" value="ALL" />
        <Tab label="PENDING" value="PENDING" />
        <Tab label="APPROVED" value="APPROVED" />
        <Tab label="DISAPPROVED" value="DISAPPROVED" />
      </Tabs>
      <Grid container spacing={3}>
        {filteredItems.map(item => (
          <Grid item key={item._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.image} // Assuming image is a URL
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status: {item.status}
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  Description: {item.description}
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  Price: Rs.{item.price}
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  Category: {item.category}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStatusChange(item._id, 'APPROVED')}
                  style={{ marginRight: '8px' }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleStatusChange(item._id, 'DISAPPROVED')}
                >
                  Disapprove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
