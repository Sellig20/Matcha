import { Link } from 'react-router-dom';
import '../../assets/styles/Navbar/Navbar.css'
import { useAuth } from '../../security/useAuth';
import { useEffect, useState } from 'react';
import { useProfile } from './User/profileContext';

const Navbar = () => {
    const { isAuthenticated } = useAuth();
    const { isProfileComplete } = useProfile();

    return (
            <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                <Link to="/apiServeur/match" className="navbar-brand">Matcha</Link>
                </div>
                <ul className="nav navbar d-flex">
                    {isAuthenticated === true && <li><Link to="/apiServeur/mymatchaprofile" type="button" className="btn btn-info me-2">My Matcha profile</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/match" type="button" className="btn btn-info me-2">Mes Match</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/fm" type="button" className="btn btn-info me-2">Fame Rating</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/chat" type="button" className="btn btn-info me-2">Chat</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/map" type="button" className="btn btn-info me-2">Map</Link></li>}
                    {isAuthenticated === true && isProfileComplete === false && <li><Link to="/apiServeur/userprofile" type="button" className="btn btn-info me-2">My UserProfile Settings</Link></li> ||
                    isAuthenticated === true && isProfileComplete === true && <li><Link to="/apiServeur/userprofile/display" type="button" className="btn btn-info me-2">My UserProfile Settings</Link></li>}
                </ul>
                <div className="d-flex">
                    {isAuthenticated === false || isAuthenticated === null && <Link to="/signup" className="btn btn-info me-2">Sign up</Link>}
                    {isAuthenticated === false || isAuthenticated === null && <Link to="/signin" className="btn btn-info">Sign in</Link>}
                </div>
            </div>
        </nav>
        );
    };
export default Navbar;