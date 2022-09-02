import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../context/ApiContext";

const OnlyUnauthRoute = () => {
  const { apiAvailable } = useApi();
  const { user } = useAuth();

  const context = () => {
    if (!apiAvailable) return <Navigate to="/unconnected" />;
    if (user) return <Navigate to="/authenticated" />;
    return <Outlet />;
  };

  return context();
};
export default OnlyUnauthRoute;
