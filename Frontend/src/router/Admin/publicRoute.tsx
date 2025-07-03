import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("adminToken");

  // If token exists, redirect to home
  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
