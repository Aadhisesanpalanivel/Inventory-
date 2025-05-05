import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import InventoryDetail from './pages/InventoryDetail';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import UserOrders from './pages/UserOrders';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import useAuthStore from './store/authStore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, loadUser]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="inventory/new" element={<InventoryDetail />} />
            <Route path="inventory/:id" element={<InventoryDetail />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="orders" element={<PrivateRoute><UserOrders /></PrivateRoute>} />
            
            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
