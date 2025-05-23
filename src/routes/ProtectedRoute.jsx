// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, authChecked, userRole } = useAuth();

  if (!authChecked) return <div>Cargando...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Inicio" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;
