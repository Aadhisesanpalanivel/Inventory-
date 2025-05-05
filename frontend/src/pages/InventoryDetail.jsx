import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import useAuthStore from '../store/authStore';
import useInventoryStore from '../store/inventoryStore';

const InventoryDetail = () => {
  const { id } = useParams();
  console.log('InventoryDetail id:', id);
  const isAddMode = !id || id === 'new';
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentItem,
    isLoading,
    error,
    fetchItem,
    updateItem,
    createItem
  } = useInventoryStore();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    supplier: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAddMode) {
      fetchItem(id);
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        supplier: '',
        description: ''
      });
    }
  }, [id, fetchItem, isAddMode]);

  useEffect(() => {
    if (currentItem && !isAddMode) {
      setFormData({
        name: currentItem.name,
        category: currentItem.category,
        quantity: currentItem.quantity.toString(),
        price: currentItem.price.toString(),
        supplier: currentItem.supplier,
        description: currentItem.description || ''
      });
    }
  }, [currentItem, isAddMode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const itemData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price)
    };

    try {
      let success;
      if (isAddMode) {
        success = await createItem(itemData);
      } else {
        success = await updateItem(id, itemData);
      }

      if (success) {
        navigate('/inventory');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save item. Please try again.' });
    }
  };

  if (isLoading && !isAddMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !isAddMode) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isAddMode ? 'Add New Item' : 'Edit Item'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={!!errors.category}
                helperText={errors.category}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                error={!!errors.supplier}
                helperText={errors.supplier}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/inventory')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={user?.role !== 'admin'}
                >
                  {isAddMode ? 'Add Item' : 'Update Item'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default InventoryDetail; 