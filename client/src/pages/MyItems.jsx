import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from "../components/Loader";
import { Card, CardContent, CardMedia, Grid, Typography, Container, Tabs, Tab, Box } from '@mui/material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const MyItems = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(0);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterItemsByStatus = (status) => {
    return status === 'ALL'
      ? items
      : items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  };

  if (!isAuthenticated) {
    return <Typography variant="h5">Please log in to view your products.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Products
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="product status tabs">
          <Tab label="ALL" />
          <Tab label="PENDING" />
          <Tab label="APPROVED" />
          <Tab label="DISAPPROVED" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container spacing={4}>
          {filterItemsByStatus('ALL').map((item) => (
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={4}>
          {filterItemsByStatus('PENDING').map((item) => (
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
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container spacing={4}>
          {filterItemsByStatus('APPROVED').map((item) => (
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
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Grid container spacing={4}>
          {filterItemsByStatus('DISAPPROVED').map((item) => (
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
      </TabPanel>
    </Container>
  );
};
