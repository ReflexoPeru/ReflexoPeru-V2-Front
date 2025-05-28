// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext';
import Style from './ProtectedRoute.module.css';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, authChecked, userRole } = useAuth();

  if (!authChecked)
    return (
      <div className={Style.container}>
        <div className={Style.loader}></div>
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Inicio" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
