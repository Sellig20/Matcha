import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './components/useAuth';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
    // path: string;
    // element?: JSX.Element;
    // exact: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {

    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return <div>Loading ...</div>;
    }
    
    if (isAuthenticated === false) {
        return <Navigate to="/signup" />;
    }
    return <Component {...rest} />;
};

export default ProtectedRoute;