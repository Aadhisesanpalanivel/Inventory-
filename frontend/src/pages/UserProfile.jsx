import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import useAuthStore from '../store/authStore';

const UserProfile = () => {
  const { user, updateProfile, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email
      }));
      // Fetch user activity
      fetchUserActivity();
    }
  }, [user]);

  const fetchUserActivity = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/activity', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setActivity(data);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
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

    const updates = {
      username: formData.username,
      email: formData.email
    };

    if (formData.newPassword) {
      updates.password = formData.newPassword;
    }

    await updateProfile(updates);
  };

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
        Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Update Profile
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                margin="normal"
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <List>
              {activity.map((item, index) => (
                <div key={item._id}>
                  <ListItem>
                    <ListItemText
                      primary={item.details}
                      secondary={new Date(item.timestamp).toLocaleString()}
                    />
                  </ListItem>
                  {index < activity.length - 1 && <Divider />}
                </div>
              ))}
              {activity.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent activity" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile; 