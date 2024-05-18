import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';

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
  const { user, getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: ''
  });

  const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Beauty'];

  useEffect(() => {
    const fetchItems = async () => {
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
    };

    fetchItems();
  }, [user, getAccessTokenSilently]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterItemsByStatus = (status) => {
    return status === 'ALL'
      ? items
      : items.filter(item => item.status === status.toLowerCase());
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await axios.post('http://localhost:4000/api/items', {
        ...newProduct,
        seller: user.email,
        status: 'pending',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleClose();
      // Optionally, refresh the items list
      const response = await axios.get(`http://localhost:4000/api/items/userEmail/${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Products
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={value} onChange={handleChange} aria-label="product status tabs">
          <Tab label="ALL" />
          <Tab label="PENDING" />
          <Tab label="APPROVED" />
          <Tab label="DISAPPROVED" />
        </Tabs>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Product
        </Button>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container spacing={4}>
          {filterItemsByStatus('ALL').map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image || 'default-image.jpg'}
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
                  image={item.image || 'default-image.jpg'}
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
                  image={item.image || 'default-image.jpg'}
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
                  image={item.image || 'default-image.jpg'}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-product-modal-title"
        aria-describedby="add-product-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="add-product-modal-title" variant="h6" component="h2">
            Add New Product
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Product Name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="image"
              label="Image URL"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
    );
  };
  

  