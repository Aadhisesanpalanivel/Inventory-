import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import useInventoryStore from '../store/inventoryStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, fetchItems, isLoading } = useInventoryStore();
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (items.length > 0) {
      const lowStock = items
        .filter(item => item.quantity < 10)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5);
      setLowStockItems(lowStock);
    }
  }, [items]);

  const quickActions = [
    {
      title: 'View Inventory',
      icon: <InventoryIcon fontSize="large" />,
      action: () => navigate('/inventory'),
      color: '#1976d2'
    },
    {
      title: 'Add New Item',
      icon: <AddIcon fontSize="large" />,
      action: () => navigate('/inventory/new'),
      color: '#4caf50',
      adminOnly: true
    },
    {
      title: 'Search Items',
      icon: <SearchIcon fontSize="large" />,
      action: () => navigate('/inventory'),
      color: '#ff9800'
    },
    {
      title: 'My Profile',
      icon: <PersonIcon fontSize="large" />,
      action: () => navigate('/profile'),
      color: '#9c27b0'
    }
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome, {user?.username}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {quickActions.map((action) => {
          if (action.adminOnly && user?.role !== 'admin') return null;
          return (
            <Grid item xs={12} sm={6} md={3} key={action.title}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                onClick={action.action}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: action.color, mr: 2 }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" component="div">
                      {action.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Inventory Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Items
                    </Typography>
                    <Typography variant="h4">
                      {items.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Low Stock Items
                    </Typography>
                    <Typography variant="h4">
                      {lowStockItems.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Low Stock Items
            </Typography>
            <List>
              {lowStockItems.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No low stock items" />
                </ListItem>
              ) : (
                lowStockItems.map((item, index) => (
                  <div key={item._id}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                    </ListItem>
                    {index < lowStockItems.length - 1 && <Divider />}
                  </div>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 