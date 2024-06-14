import React, { Component, useEffect, useState } from 'react';
import { Route, Navigate, RouteProps, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { nextTick } from 'process';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
    // path: string;
    element?: JSX.Element;
    // exact: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("\n\n........................... dans checkAuth de Protected Route ..................................\n\n")
                const token = localStorage.getItem('token'); 
                console.log("TOKEN ===> ", token);
                if (!token) {
                    console.log("pas de token dans protected routes");
                    setIsAuthenticated(false);
                    return;
                }
                const response = await axios.get('http://localhost:8000/apiServeur/home', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response from /apiServeur/home: ", response.data);
                setIsAuthenticated(response.data.valid);
                console.log("+++++++++++------------------------- derriere set is auth ----------------------+++++++++");
                
            } catch (err) {
                console.log("-------------------------- nop dop -------------------");
                console.log("Error during auth check: ", err);    
                if (axios.isAxiosError(err)) {
                    console.error("Error response:", err.response?.data);
                }
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);
    // useEffect(() => {
        // const checkAuth = async () => {
            // try {
                // const response = await axios.get('http://localhost:8000/home', { withCredentials: true });
                // setIsAuthenticated(response.data.valid);
            // } catch (err) {
    //             setIsAuthenticated(false);
    //         }
    //     };
    //     checkAuth();
    // }, []);

    if (isAuthenticated === null) {
        return <div>Loading ...</div>;
    }

    if (isAuthenticated === false) {
        return <Navigate to="/signup" />;
    }

    return <Component {...rest} />;

    // return isAuthenticated ? <Component /> : <Navigate to="/signup" />
    //    <Route
            // {...rest}
    //    />
    // )
};

export default ProtectedRoute;