import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./features/auth/redux/authSlice";
import AppRoutes from "./routes/AppRoutes";
import { serverEndpoint } from "./config/appConfig";

function App() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    console.log("API URL:", serverEndpoint);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return <AppRoutes />;
}

export default App;
