import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

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

    const logout = () => {
        localStorage.clear();
        // window.location.href = '/';
        navigate('/signup');
    }

    return (
        <div>
            <div id="mySidenav" className="sidenav">
                <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
                <a href="#">User settings</a>
                <a href="#">Confidentiality politic</a>
                <a href="#">Report something</a>
                <a href="" onClick={logout}>Disconnect</a>
            </div>

            <div id="main">
                {!isOpen && <span style={{fontSize: '20px', cursor: 'pointer'}} className="openbtn" onClick={openNav}>&#9776; open</span>}
            </div>
        </div>
    );
}

export default Sidebar;