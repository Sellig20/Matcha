import { Link } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const { isAuthenticated } = useAuth();

    return (
            <nav className="navbar navbar-inverse">
            <div className="container-fluid">
                <div className="navbar-header">
                <a className="navbar-brand" href="#">Matcha</a>
                </div>
                <ul className="nav navbar-nav">
                    <li>bonjou</li>
                    {isAuthenticated === true && <li><Link to="/fm">FameRating</Link></li>}
                <li className="active"><a href="#">Home</a></li>
                <li><a href="#">Link</a></li>
                <li><a href="#">Link</a></li>
                </ul>
                <button className="btn btn-danger navbar-btn">Button</button>
            </div>
        </nav>
        );
    };
export default Navbar;