import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  // Si no está logueado, lo mandamos al login (auth)
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};