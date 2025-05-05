import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Login failed', isLoading: false });
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  },

  register: async (username, email, password, adminCode) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/register`, { 
        username, 
        email, 
        password,
        adminCode 
      });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Registration failed', isLoading: false });
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Logged out successfully!');
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to load user', isLoading: false });
      localStorage.removeItem('token');
    }
  },

  updateProfile: async (updates) => {
    try {
      set({ isLoading: true });
      const response = await axios.put(`${API_URL}/users/profile`, updates, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      set({ user: response.data, isLoading: false });
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to update profile', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to update profile');
      return false;
    }
  }
}));

export default useAuthStore; 