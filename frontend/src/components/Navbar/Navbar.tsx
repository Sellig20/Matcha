import { Link } from 'react-router-dom';
import '../../assets/styles/Navbar/Navbar.css'
import { useAuth } from '../../security/useAuth';
import { useEffect, useState } from 'react';
import { useProfile } from './User/profileContext';
import axiosInstance from '../../security/axiosInstance';

const Navbar = () => {

    const [message, setMessage] = useState('');
    const { isAuthenticated } = useAuth();
    const { isProfileComplete } = useProfile();
    const [id, setId] = useState('');

    const fetchId = async () => {
        try {
            const response = await axiosInstance.get('http://localhost:8000/apiServeur/navbar');
            // console.log("\n\n\n\n || NAVBAR : id of the user : ", response.data.userId);
            setId(response.data.userId);
        } catch (error) {
            setMessage(`Navbar.tsx | Erreur frontend navbar FETCH ID: ${error}`);
        }
    }

    useEffect(() => {
        try {
            if (isAuthenticated) {
                fetchId();
            }
        } catch (error) {
            setMessage(`Navbar.tsx | Erreur frontend navbar : ${error}`);
        }
    })

    return (
            <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                <Link to="/apiServeur/match" className="navbar-brand">Matcha</Link>
                </div>
                <ul className="nav d-flex">
                    {isAuthenticated === true && <li><Link to={`/apiServeur/mymatchaprofile/${id}`} type="button" className="btn-navbar me-2">Proposition de Matcha et mon profil</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/match" type="button" className="btn-navbar me-2">Mes Match I matched</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/allusers" type="button" className="btn-navbar me-2">--x-- All user --x--</Link></li>}
                    {isAuthenticated === true && <li><Link to={`/apiServeur/fm/${id}`} type="button" className="btn-navbar me-2">Fame Rating</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/chat" type="button" className="btn-navbar me-2">Chat</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/map" type="button" className="btn-navbar me-2">Map</Link></li>}
                    {isAuthenticated === true && isProfileComplete === false && <li><Link to="/apiServeur/userprofile" type="button" className="btn-navbar me-2">My UserProfile Settings</Link></li> ||
                    isAuthenticated === true && isProfileComplete === true && <li><Link to="/apiServeur/userprofile/display" type="button" className="btn-navbar me-2">My UserProfile Settings</Link></li>}
                </ul>
                <div className="nav d-flex">
                    {isAuthenticated === false || isAuthenticated === null && <Link to="/signup" className="btn-navbar me-2">Sign up</Link>}
                    {isAuthenticated === false || isAuthenticated === null && <Link to="/signin" className="btn-navbar me-2">Sign in</Link>}
                </div>
            </div>
        </nav>
        );
    };
export default Navbar;