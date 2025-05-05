import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import useOrderStore from '../store/orderStore';

const AdminDashboard = () => {
  const { orders, isLoading, getAllOrders, acceptOrder, deliverOrder, rejectOrder } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'success' : 'error';
  };

  const handleAccept = async (orderId) => {
    await acceptOrder(orderId);
    getAllOrders();
  };

  const handleDeliver = async (orderId) => {
    await deliverOrder(orderId);
    getAllOrders();
  };

  const handleReject = async (orderId) => {
    await rejectOrder(orderId);
    getAllOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate dashboard statistics
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    acceptedOrders: orders.filter(o => o.status === 'accepted').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Orders</Typography>
              <Typography variant="h4">{stats.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Pending Orders</Typography>
              <Typography variant="h4">{stats.pendingOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Accepted Orders</Typography>
              <Typography variant="h4">{stats.acceptedOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Delivered Orders</Typography>
              <Typography variant="h4">{stats.deliveredOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Typography variant="h5" sx={{ mb: 2 }}>Order Management</Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Orders"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No orders found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-6)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, index) => (
                      <Typography key={index} variant="body2">
                        {item.item.name} x {item.quantity}
                        {item.requirements && ` (${item.requirements})`}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    ${order.items.reduce((total, item) => 
                      total + (item.item.price * item.quantity), 0
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.paymentStatus} 
                      color={getPaymentStatusColor(order.paymentStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.status === 'pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAccept(order._id)}
                          disabled={isLoading}
                          sx={{ mr: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleReject(order._id)}
                          disabled={isLoading}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleDeliver(order._id)}
                        disabled={isLoading}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminDashboard; 