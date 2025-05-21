// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, authChecked, userRole } = useAuth();

  if (!authChecked) return <div>Cargando...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Inicio" replace />; // o a un componente de acceso denegado
  }

  return <Outlet />;
};

export default ProtectedRoute;
