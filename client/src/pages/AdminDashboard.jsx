import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, Typography, Container, Grid, Card, CardContent, Button, CardMedia, ButtonGroup, Tooltip } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BlockIcon from '@mui/icons-material/Block';

export const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/items');
      const itemsWithStatus = response.data.map(item => ({
        ...item,
        status: item.status || 'pending', // Default to 'pending' if no status
      }));
      setItems(itemsWithStatus);
      filterItems(itemsWithStatus, statusFilter); // Filter items based on the current status filter
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filterItems = (items, status) => {
    if (status === 'ALL') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => item.status === status.toLowerCase());
      setFilteredItems(filtered);
    }
  };

  // Filter items based on status
  useEffect(() => {
    filterItems(items, statusFilter);
  }, [items, statusFilter]);

  // Function to handle status change (approve/disapprove)
  const handleStatusChange = async (itemId, newStatus) => {
    try {
      // Update status in the backend
      await axios.patch(`http://localhost:4000/api/items/${itemId}`, { status: newStatus });

      // Refetch items from the backend to update the UI
      fetchItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
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
        <Tab label="PENDING" value="pending" />
        <Tab label="APPROVED" value="approved" />
        <Tab label="DISAPPROVED" value="disapproved" />
        <Tab label="SUSPENDED" value="suspended" />
      </Tabs>
      <br/>
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
                <ButtonGroup>
                <Tooltip title="Approve item">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusChange(item._id, 'approved')}
                    style={{ marginRight: '5px' }}
                  >
                    <AddTaskIcon/>
                  </Button>
                  </Tooltip>
                  <Tooltip title="Disapprove item">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatusChange(item._id, 'disapproved')}
                  >
                    <HighlightOffIcon/>
                  </Button>
                  </Tooltip>
                  <Tooltip title="Suspend item">
                  <Button

                    variant="contained"
                    color="warning"
                    onClick={() => handleStatusChange(item._id, 'suspended')}
                  >
                   <BlockIcon/>
                  </Button>
                  </Tooltip>
                </ButtonGroup>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
