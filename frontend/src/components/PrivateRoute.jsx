import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loadUser, isLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, loadUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 