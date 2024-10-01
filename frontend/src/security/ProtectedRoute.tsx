import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './useAuth';
import { Link } from 'react-router-dom';
import '../assets/styles/Error.css'

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
    // path: string;
    // element?: JSX.Element;
    // exact: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {

    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return (
            <section className="gradient-custom-error" >
            <div><Link to="/signup" style={{ textDecoration: 'none'}}>Sign up </Link>
                or
                <Link to="/signin" style={{ textDecoration: 'none' }}> Sign in </Link>
                to access the Matchamallow community ! 🩷</div>
            </section>
        )
    }
    if (isAuthenticated === false) {
        return <Navigate to="/signup" />;
    }
    return <Component {...rest} />;
};

export default ProtectedRoute;