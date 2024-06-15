import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
    // path: string;
    element?: JSX.Element;
    // exact: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token'); 
                console.log("Protectedroute.tsx | TOKEN ===> ", token);
                if (!token) {
                    console.log("Protectedroute.tsx | Pas de token dans protected routes");
                    setIsAuthenticated(false);
                    return;
                }
                const response = await axios.get('http://localhost:8000/apiServeur/checktok', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAuthenticated(response.data.valid);
                console.log("Protectedroute.tsx | Response from /apiServeur/usersettings: ", response.data);
            } catch (err) {
                console.log("Protectedroute.tsx | Error during auth check: ", err);    
                if (axios.isAxiosError(err)) {
                    console.error("Protectedroute.tsx | Error response:", err.response?.data);
                }
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading ...</div>;
    }
    if (isAuthenticated === false) {
        return <Navigate to="/signup" />;
    }
    return <Component {...rest} />;
};

export default ProtectedRoute;