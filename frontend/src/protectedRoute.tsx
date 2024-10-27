import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./slices/store";

interface ProtectedRouteProps {
  element: React.ElementType;
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
  ...rest
}) => {
  const admin = useAppSelector((state) => state.adminSlice.admin);

  if (admin) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/admin/signin" />;
  }
};

export default ProtectedRoute;
