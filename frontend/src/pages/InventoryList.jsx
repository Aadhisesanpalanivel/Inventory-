import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import useInventoryStore from '../store/inventoryStore';
import OrderDialog from './OrderDialog';

const InventoryList = () => {
  const { user } = useAuthStore();
  const {
    items,
    isLoading,
    filters,
    setFilters,
    fetchItems,
    deleteItem
  } = useInventoryStore();
  const navigate = useNavigate();
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Inventory</Typography>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/inventory/new')}
          >
            Add Item
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search items..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/inventory/${item._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    {user?.role === 'admin' && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {user?.role !== 'admin' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => { setSelectedItem(item); setOrderDialogOpen(true); }}
                      >
                        Order
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <OrderDialog open={orderDialogOpen} item={selectedItem} onClose={() => setOrderDialogOpen(false)} />
    </Box>
  );
};

export default InventoryList; 