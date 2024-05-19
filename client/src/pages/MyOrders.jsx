import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Container,
  Box,
  Grid,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../components/Loader";

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ordered");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const { user, getAccessTokenSilently, isLoading } = useAuth0();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getAccessTokenSilently();

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/orders/my-orders/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const orderedOrders = response.data.filter(
          (order) => order.status === "ordered"
        );
        const sortedOrders = orderedOrders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (!isLoading) {
      fetchOrders();
    }
  }, [isLoading, getAccessTokenSilently, user]);

  const handleFilterChange = () => {
    if (
      startDateFilter &&
      endDateFilter &&
      new Date(startDateFilter) >= new Date(endDateFilter)
    ) {
      alert("End date must be greater than start date");
      return;
    }

    let filtered = orders;

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (startDateFilter && endDateFilter) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const startDate = new Date(startDateFilter);
        const endDate = new Date(endDateFilter);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setFilteredOrders(filtered);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Typography variant="h4" gutterBottom>
            My Orders
          </Typography>

          <Box mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="ordered">Ordered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={3}>
                <CustomDatePicker
                  label="Start Date"
                  value={startDateFilter}
                  onChange={setStartDateFilter}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <CustomDatePicker
                  label="End Date"
                  value={endDateFilter}
                  onChange={setEndDateFilter}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFilterChange}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Box>

          {filteredOrders.map((order) => (
            <Accordion key={order._id} sx={{ marginBottom: "1rem" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order ID:
                    </Typography>
                    <Typography variant="body2">{order._id}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Status:
                    </Typography>
                    <Typography variant="body2">{order.status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order Date:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Grand Total:
                    </Typography>
                    <Typography variant="body2">
                      ₹{order.orderGrandTotal}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Items:
                  </Typography>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id} style={{ marginBottom: "0.5rem" }}>
                        <Box>
                          <Typography variant="body2">
                            <strong>Item:</strong> {item.item.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantity:</strong> {item.quantity}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Price:</strong> ₹{item.item.price}
                          </Typography>
                        </Box>
                      </li>
                    ))}
                  </ul>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      )}
    </>
  );
};

const CustomDatePicker = ({ label, value, onChange }) => {
  return (
    <TextField
      type="date"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};
