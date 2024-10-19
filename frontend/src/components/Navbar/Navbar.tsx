import { Link, UNSAFE_ErrorResponseImpl } from 'react-router-dom';
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
            console.log("\n\n\n\n response navbar is ", response.data.userId);
            setId(response.data.userId);
        } catch (error) {
            setMessage(`Navbar.tsx | Erreur frontend navbar FETCH ID: ${error}`);
        }
    }

    useEffect(() => {
        try {
            fetchId();
            console.log("aaa")
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
                <ul className="nav navbar d-flex">
                    {isAuthenticated === true && <li><Link to={`/apiServeur/mymatchaprofile/${id}`} type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>My Matcha profile</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/match" type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>Mes Match</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/allusers" type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>--x-- All user --x--</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/fm" type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>Fame Rating</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/chat" type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>Chat</Link></li>}
                    {isAuthenticated === true && <li><Link to="/apiServeur/map" type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>Map</Link></li>}
                    {isAuthenticated === true && isProfileComplete === false && <li><Link to="/apiServeur/userprofile" type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>My UserProfile Settings</Link></li> ||
                    isAuthenticated === true && isProfileComplete === true && <li><Link to="/apiServeur/userprofile/display" type="button" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>My UserProfile Settings</Link></li>}
                </ul>
                <div className="d-flex">
                    {isAuthenticated === false || isAuthenticated === null && <Link to="/signup" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>Sign up</Link>}
                    {isAuthenticated === false || isAuthenticated === null && <Link to="/signin" className="btn btn-info me-2" style={{ color: 'white', fontFamily: "posterable"}}>Sign in</Link>}
                </div>
            </div>
        </nav>
        );
    };
export default Navbar;