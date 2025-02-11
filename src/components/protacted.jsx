

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if (userRole === "guest") {
        return <Navigate to="/home" replace />;
    }
    return children;
};

export default ProtectedRoute;
