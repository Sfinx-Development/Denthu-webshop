import { Navigate } from "react-router-dom";
import { useAppSelector } from "./slices/store";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const admin = useAppSelector((state) => state.adminSlice.admin);

  if (admin) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/admin/signin" />;
  }
};

export default ProtectedRoute;
