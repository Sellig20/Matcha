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

    //get my informations

    //get Matchs informations

    //link to all my matched and suggestions and suggestions = userproduct possibility to like and matched = user product heart clicked

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
        <h1>Hello <span className="colorH1">id n° {profile.profile?.id}</span> ! </h1> 
        <h3>
            MY matcha profile = sur la gauche mon PROFIL, sur la droite QUI JE MATCHE AUJOURDHUI
        </h3>
        </div>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-10 col-xl-80">
                    <h3>1 il faudra la search bar ici</h3>
                    <div className="card shadow-2-strong"style={{ borderRadius: '60px', padding: '20px'}}>
                    <div className="d-flex" style={{ gap: "20px" }}> {/*les deux boites verticales*/}


                            {/* Rectangle vertical à gauche */}
                            <div className="col-md-4" style={{ width: "300px"}}>
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '30px', width: '100%', height: '100%' }}>
                                <h3> MON PROFIL </h3>
                                    <div className="card-body card-picture">
                                        <p> ///PHOTO////</p>
                                    </div>
                                    <div className="card-body">
                                        <p>{profile?.profile?.first_name}, {profile?.profile?.age} years old, Paris</p>
                                        <p>I'm looking for : <span> {profile?.profile?.sexual_interest}</span></p>
                                        <p> I am : <span>{profile?.profile?.gender}</span></p>
                                        <button>change my profile</button>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column" style={{ gap:"5px", flex: 1}}>{/*BOITE 2*/}

                                <div className="card shadow-2-strong mb-2" style={{ borderRadius: '20px', height: '48%' }}>
                                    <div className="d-flex flex-row">
                                        <div className="card-body" style={{ flex: 1}}>
                                           <p>HELLO TODAY WE FOUND YOU :</p>
                                        </div>

                                        <div className="card-body" style={{ flex: 1, margin: "50px"}}>
                                            <p>gjgjgjgjgjgjg</p>
                                        </div>
                                    </div>
                                    <h3>4 it is a match ! photos de Maxence</h3>
                                        <div className="card-body d-flex align-items-center justify-content-center">
                                            <h3 className="text-center">Rectangle 1</h3>
                                        </div>
                                </div>

                                <div className="card shadow-2-strong mb-2" style={{ borderRadius: "30px", width: "100%", height: '100%', paddingLeft: "10px" }}>
                                <div className="card-body"></div>
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