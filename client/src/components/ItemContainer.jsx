import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Container,
  Button,
  Slider,
  TextField,
  MenuItem,
} from '@mui/material';

export const ItemContainer = () => {
  const [items, setItems] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/items/approvedItems');
        setItems(response.data);
        setFilteredItems(response.data);
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
        { productId, userEmail, quantity: 1 },
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

  const applyFilters = () => {
    const filtered = items.filter((item) => {
      const priceInRange = item.price >= priceRange[0] && item.price <= priceRange[1];
      const categoryMatch = categoryFilter === '' || item.category === categoryFilter;
      const queryMatch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return priceInRange && categoryMatch && queryMatch;
    });
    setFilteredItems(filtered);
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleResetFilters = () => {
    setPriceRange([0, 100000]);
    setCategoryFilter('');
    setSearchQuery('');
    setFilteredItems(items);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        All products
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">Price Range:</Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={100000}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Home">Home</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: '16px' }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleResetFilters}
            startIcon={<RestartAltIcon />}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={4}>
        {filteredItems.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.image}
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
                  Category: {item.category}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Price: Rs.{item.price}
                  </Typography>
                {isAuthenticated && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(item._id, user.email)}
                  >
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
