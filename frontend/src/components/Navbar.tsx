import { Link } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const { isAuthenticated } = useAuth();

    return (
            <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                <a className="navbar-brand" href="#">Matcha</a>
                </div>
                <ul className="nav navbar d-flex">
                    {isAuthenticated === true && <li><Link to="/fm" type="button" className="btn btn-warning me-2">Match</Link></li>}
                    {isAuthenticated === true && <li><Link to="/fm" type="button" className="btn btn-warning me-2">Fame Rating</Link></li>}
                    {isAuthenticated === true && <li><Link to="/fm" type="button" className="btn btn-warning me-2">Chat</Link></li>}
                    {isAuthenticated === true && <li><Link to="/fm" type="button" className="btn btn-warning me-2">Chat</Link></li>}
                </ul>
                <div className="d-flex">
                    {isAuthenticated === false && <Link to="/signup" className="btn btn-primary me-2">Sign up</Link>}
                    {isAuthenticated === false && <Link to="/signin" className="btn btn-primary">Sign in</Link>}
                </div>
            </div>
        </nav>
        );
    };
export default Navbar;