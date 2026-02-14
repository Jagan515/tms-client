import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>; // Or a proper Spinner component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to unauthorized page or default dashboard based on role
        if (role === 'student') return <Navigate to="/student/dashboard" replace />;
        if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
        if (role === 'parent') return <Navigate to="/parent/dashboard" replace />;
        if (role === 'developer') return <Navigate to="/developer/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
