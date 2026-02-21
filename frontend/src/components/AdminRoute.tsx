import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingBar from "./LoadingBar";

const AdminRoute = () => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("token");
                const userStr = localStorage.getItem("user");

                if (!token || !userStr) {
                    setIsAuthorized(false);
                    return;
                }

                const user = JSON.parse(userStr);
                if (user.role === "admin") {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthorized === null) {
        return <LoadingBar />;
    }

    if (!isAuthorized) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
