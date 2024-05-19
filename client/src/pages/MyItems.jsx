import React, { useState, useEffect } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../components/Loader";

const categories = ["Electronics", "Books", "Clothing", "Home", "Sports"];

export const MyItems = () => {
  const { user, getAccessTokenSilently, isLoading } = useAuth0();
  const [products, setProducts] = useState([]);
  const [tabValue, setTabValue] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const fetchProducts = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(
        `http://localhost:4000/api/items/userEmail/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isLoading]);

  const handleAddProduct = async (event) => {
    event.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        "http://localhost:4000/api/items",
        {
          ...newProduct,
          sellerEmail: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        fetchProducts(); // Refresh products list
        handleClose();
        setNewProduct({
          name: "",
          description: "",
          category: "",
          price: "",
          image: "",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (tabValue === "ALL") return true;
    return product.status === tabValue.toLowerCase();
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            My Products
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All" value="ALL" />
              <Tab label="Pending" value="PENDING" />
              <Tab label="Approved" value="APPROVED" />
              <Tab label="Disapproved" value="DISAPPROVED" />
            </Tabs>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{ marginLeft: "auto" }}
            >
              Add Product
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
              {filteredProducts.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image || "default-image.jpg"}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        Category: {product.category}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        Price: Rs.{product.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Modal open={open} onClose={handleClose}>
            <Box
              component="form"
              onSubmit={handleAddProduct}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Add New Product
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
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
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  label="Category"
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
          </Modal>
        </Container>
      )}
    </>
  );
};
