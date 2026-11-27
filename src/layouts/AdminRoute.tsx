import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router";
import { isAdmin, isLoggedIn } from "../auth/auth";


const AdminRoute = ({ children }: { children: ReactElement }) => {
  const location = useLocation();

  if (!isLoggedIn()) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin()) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;