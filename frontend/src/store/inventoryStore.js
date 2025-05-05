import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const useInventoryStore = create((set) => ({
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    search: ''
  },

  setFilters: (filters) => set({ filters }),

  fetchItems: async () => {
    try {
      set({ isLoading: true });
      const { category, search } = useInventoryStore.getState().filters;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await axios.get(`${API_URL}/inventory?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch items', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to fetch items');
    }
  },

  fetchItem: async (id) => {
    if (!id) {
      set({ error: 'Invalid item ID', isLoading: false });
      return;
    }
    try {
      set({ isLoading: true });
      const response = await axios.get(`${API_URL}/inventory/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      set({ currentItem: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch item', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to fetch item');
    }
  },

  createItem: async (itemData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/inventory`, itemData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      set(state => ({
        items: [...state.items, response.data],
        currentItem: response.data,
        isLoading: false
      }));
      toast.success('Item created successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create item';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  updateItem: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`${API_URL}/inventory/${id}`, updates, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      set(state => ({
        items: state.items.map(item => 
          item._id === id ? response.data : item
        ),
        currentItem: response.data,
        isLoading: false
      }));
      toast.success('Item updated successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update item';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  deleteItem: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`${API_URL}/inventory/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      set(state => ({
        items: state.items.filter(item => item._id !== id),
        currentItem: state.currentItem?._id === id ? null : state.currentItem,
        isLoading: false
      }));
      toast.success('Item deleted successfully!');
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete item', isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to delete item');
      return false;
    }
  }
}));

export default useInventoryStore; 