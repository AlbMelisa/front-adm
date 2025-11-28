import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/authContext/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h2>Cargando...</h2>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
