import { Link } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const { isAuthenticated } = useAuth();

    return (
        <nav>
            <ul>
                bonjou
            {isAuthenticated === true && <li><Link to="/fm">FameRating</Link></li>}
            </ul>
        </nav>
    );
};

export default Navbar;