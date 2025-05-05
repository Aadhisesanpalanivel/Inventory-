import { useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import useOrderStore from '../store/orderStore';

const UserOrders = () => {
  const { myOrders, isLoading, getMyOrders, payOrder } = useOrderStore();

  useEffect(() => {
    getMyOrders();
  }, [getMyOrders]);

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

  const handlePay = async (orderId) => {
    await payOrder(orderId);
    getMyOrders(); // Refresh orders after payment
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>My Orders</Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : myOrders.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You have no orders yet.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-6)}</TableCell>
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
                    {order.paymentStatus === 'pending' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handlePay(order._id)}
                        disabled={isLoading}
                      >
                        Pay Now
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

export default UserOrders; 