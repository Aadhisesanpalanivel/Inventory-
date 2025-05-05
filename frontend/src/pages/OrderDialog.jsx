import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import useOrderStore from '../store/orderStore';

const OrderDialog = ({ open, item, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [requirements, setRequirements] = useState('');
  const { placeOrder, isLoading } = useOrderStore();

  const handleSubmit = async () => {
    if (!item) return;
    
    const orderItems = [{
      item: item._id,
      quantity: parseInt(quantity),
      requirements: requirements.trim()
    }];

    const result = await placeOrder(orderItems);
    if (result) {
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Place Order</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">{item.name}</Typography>
          <Typography color="text.secondary">Price: ${item.price.toFixed(2)}</Typography>
          <Typography color="text.secondary">Available: {item.quantity}</Typography>
        </Box>

        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(item.quantity, parseInt(e.target.value) || 1)))}
          inputProps={{ min: 1, max: item.quantity }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Special Requirements (Optional)"
          multiline
          rows={3}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDialog; 