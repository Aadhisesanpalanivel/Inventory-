import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://inventory-r90g.onrender.com/api/order';

const useOrderStore = create((set) => ({
  orders: [],
  myOrders: [],
  isLoading: false,
  error: null,

  placeOrder: async (items) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${API_URL}/`, { items }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Order placed!');
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to place order', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to place order');
      return null;
    }
  },

  payOrder: async (orderId) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${API_URL}/${orderId}/pay`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Payment successful!');
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Payment failed', isLoading: false });
      toast.error(error.response?.data?.error || 'Payment failed');
      return null;
    }
  },

  getMyOrders: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`${API_URL}/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      set({ myOrders: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch orders', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to fetch orders');
    }
  },

  getAllOrders: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch orders', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to fetch orders');
    }
  },

  acceptOrder: async (orderId) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${API_URL}/${orderId}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Order accepted!');
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to accept order', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to accept order');
      return null;
    }
  },

  deliverOrder: async (orderId) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${API_URL}/${orderId}/deliver`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Order delivered!');
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to deliver order', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to deliver order');
      return null;
    }
  },

  rejectOrder: async (orderId) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${API_URL}/${orderId}/reject`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Order rejected!');
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to reject order', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to reject order');
      return null;
    }
  }
}));

export default useOrderStore; 
