import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute; 