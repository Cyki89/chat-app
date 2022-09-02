import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../context/ApiContext";

const ProtectedRoute = ({ allowedRole = null }) => {
  const { apiAvailable } = useApi();
  const { user } = useAuth();
  const location = useLocation();

  const context = () => {
    if (!apiAvailable) return <Navigate to="/unconnected" />;
    if (!user)
      return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRole && allowedRole !== user.role)
      return <Navigate to="/unauthorized" />;

    return <Outlet />;
  };

  return context();
};
export default ProtectedRoute;
