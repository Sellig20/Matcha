import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import "../../../assets/styles/Navbar/User/MatchaProfile.css"
import { useForm } from './useForm';
import { useProfile } from './profileContext';
import { useParams } from 'react-router-dom';

const MatchaProfile: React.FC = () => {

    const { fetchProfile } = useProfile();
    const [message, setMessage] = useState('');
    const profile = useProfile();

    useEffect(() => {
        try {
            fetchProfile();
        } catch (error) {
            setMessage(`UserProfile.tsx | Erreur frontend userprofile : ${error}`);
        }
    }, [])

    return (
        <section className="gradient-custom">
        <div>
        <h1>Hello <span className="colorH1">{profile.profile?.first_name}</span> ! </h1> 
        <h1>Hello <span className="colorH1">id numero{profile.profile?.userprofileid}</span> ! </h1> 
        <h3>
            MY matcha profile = sur la gauche mon PROFIL, sur la droite QUI JE MATCHE AUJOURDHUI
        </h3>
        </div>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-12 col-xl-8">
                    <h3>1 il faudra la search bar ici</h3>
                    <div className="card shadow-2-strong" style={{ borderRadius: '20px', padding: '20px', height: '600px' }}>
                    <h3>2</h3>
                    <div className="row h-100">

                            {/* Rectangle vertical à gauche */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                <h3>3 Profil de la Lola</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle Vertical</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Rectangles horizontaux à droite */}
                            <div className="col-md-8 d-flex flex-column justify-content-between">
                                {/* Premier rectangle horizontal */}
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '20px', height: '48%' }}>
                                <h3>4 it is a match ! photos de Maxence</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 1</h3>
                                    </div>
                                </div>

                                {/* Deuxième rectangle horizontal */}
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', height: '48%' }}>
                                <h3>5 informations de Maxence + oui / non je like</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 2</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <h3>6 matchs suivants et plus redirection to "mes matchs"</h3>
                    </div>
                </div>
            </div>
        </div>
    </section>
)}

export default MatchaProfile;