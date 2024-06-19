import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../security/useAuth';
import { Link } from 'react-router-dom';
import { AuthContext } from '../security/authContext';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const setAuth = useContext(AuthContext);
    
    if (!setAuth) {
        throw new Error("Sidebar must be used within an AuthProvider");
    }
    
    const { signedOut } = setAuth;

    const openNav = () => {
        document.getElementById("mySidenav")!.style.width = "250px";
        document.getElementById("main")!.style.marginRight = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        setIsOpen(true);
    }

    const closeNav = () => {
        document.getElementById("mySidenav")!.style.width = "0";
        document.getElementById("main")!.style.marginRight = "0";
        document.body.style.backgroundColor = "white";
        setIsOpen(false);
    }

    const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        // localStorage.clear();
        // setAuth(null);
        await signedOut();
        console.log("-----LOG OUT----")
        navigate('/signup');
    };
    
    return (
        <div>
            <div id="mySidenav" className="sidenav">
                <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
                {<Link to="/apiServeur/usersettings" className="sidebar-link">Users settings</Link>}
                {<Link to="/apiServeur/usersettings" className="sidebar-link">Confidentiality politic</Link>}
                {<Link to="/apiServeur/usersettings" className="sidebar-link">Report something</Link>}
                {<a href="#" onClick={handleLogout}>Disconnect</a>}
            </div>
            <div id="main">
                {!isOpen && <span style={{fontSize: '20px', cursor: 'pointer'}} className="openbtn" onClick={openNav}>&#9776; open</span>}
            </div>
        </div>
    );
}

export default Sidebar;