import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ roles, children }) {

    const user = useSelector((state) => state.userDetails);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
