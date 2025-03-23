import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = !!localStorage.getItem("token"); // Change this based on your auth system

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
