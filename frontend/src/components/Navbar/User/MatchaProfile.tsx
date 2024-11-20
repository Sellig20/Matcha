import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import "../../../assets/styles/Navbar/User/MatchaProfile.css"
import { useProfile } from './profileContext';
import { useNavigate, useParams } from 'react-router-dom';
import { UserProfileInterface } from './UserInterface';

const MatchaProfile: React.FC = () => {

    const { fetchProfile } = useProfile();
    const [message, setMessage] = useState('');
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<UserProfileInterface[]>([]);
    const { isProfileComplete } = useProfile();
    const [notification, setNotification] = useState<string | null>(null);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    //get my informations
    const profile = useProfile();
    //get Matchs informations
    const getSuggestedMatch = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchsusers`);
            setMessage(response.data.message);
            setMyId(response.data.myId);
            setUsers(response.data.listName);
            console.log("\n\n users =>> Match users >>>> ", response.data.listName, "\n\n");
        } catch (error) {
            setMessage(`MatchaProfile.tsx | Erreur frontend get  : ${error}`);
        }
    }

    const handleNavigateNotification = () => {
        navigate(`/apiServeur/userprofile`);
    };

    const handleClickPrevious = () => {
        if (currentIndex >= 0 && currentIndex <= users.length - 1) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setMessage("Sorry, no more matchas for today !");
        }
    }

    const handleClickNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setMessage("Sorry, no more matchas for today !");
        }
    }
    //link to all my matched and suggestions and suggestions = userproduct possibility to like and matched = user product heart clicked

    useEffect(() => {
        try {
            if (isProfileComplete === false) {
                setNotification("Warning : You must fill your profile before going on");
            }
            else { 
                fetchProfile();
                getSuggestedMatch();
            }
        } catch (error) {
            setMessage(`UserProfile.tsx | Erreur frontend userprofile : ${error}`);
        }
    }, [])

    return (
        <section className="gradient-custom">
        <div>
        <h1>Hello <span className="colorH1">{profile.profile?.first_name}</span> ! </h1> 
        <h1>Hello <span className="colorH1">id n° {profile.profile?.id}</span> ! </h1>
        <div>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>

        {notification && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>{notification}</p>
                    <button className="btn-userproduct" onClick={handleNavigateNotification}>OK</button>
                </div>
            </div>
        )}

        </div>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-12 col-xl-80">
                    <h3>1 il faudra la search bar ici</h3>
                    <div className="card shadow-2-strong" style={{ borderRadius: '60px', padding: '20px'}}>
                    <div className="d-flex" style={{ gap: "20px" }}> {/*les deux boites verticales*/}

                            {/* Rectangle vertical à gauche */}
                            <div className="col-md-4" style={{ width: "300px"}}>
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '30px', width: '100%', height: '100%' }}>
                                <h3> MON PROFIL </h3>
                                    <div className="card-body card-picture">
                                        <p> ///PHOTO de moi////</p>
                                    </div>
                                    <div className="card-body">
                                        <p><span> {profile?.profile?.first_name}, {profile?.profile?.age} years old, Paris</span></p>
                                        <p>I'm looking for : <span> {profile?.profile?.sexual_interest}</span></p>
                                        <p> I am : <span>{profile?.profile?.gender}</span></p>
                                        <button>change my profile</button>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column" style={{ gap:"5px", flex: 1}}>{/*BOITE 2*/}

                                <div className="card shadow-2-strong mb-2" style={{ borderRadius: '30px'}}>
                                    <div className="d-flex flex-row" style={{ flex: 1, border: "solid grey 3px"}}>
                                        <div className="card-body" style={{ flex: 1, border: "solid red 3px"}}>
                                           <p>HELLO TODAY WE FOUND YOU :</p>
                                           <div className="card-body d-flex flex-column firstname"
                                                key={users[currentIndex]?.id}>
                                                {users[currentIndex]?.user_name}, {users[currentIndex]?.age}, Paris
                                                {users[currentIndex]?.tags_1}
                                            </div>
                                                tag 1 <br /> tags 2 <br /> tag3 <br /> biography sex i et genderrrr
                                            <div className="flex-row">
                                                <button
                                                    className="button-prev-next"
                                                    onClick={() => handleClickPrevious()}
                                                    >previous match suggested
                                                </button>
                                                <button
                                                    className="button-prev-next"
                                                    onClick={() => handleClickNext()}
                                                    >next suggested match
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-body" style={{ flex: 1, border: "solid red 3px"}}>
                                            <div className="card-body card-picture"
                                            style={{width: "100%", height: "100%"}}
                                            >
                                                <p> ///PHOTO du match suggested////</p>
                                                <button
                                                    className="button-prev-next"
                                                    // onClick={() => handleClickPrevious()}
                                                    >previous picture
                                                </button>
                                                <button
                                                    className="button-prev-next"
                                                    // onClick={() => handleClickNext()}
                                                    >next picture
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                        <div 
                                            className="card-body d-flex align-items-center justify-content-center"
                                            style={{border: "solid red 3px"}}
                                            >
                                            <div className="d-flex justify-content-center mb-3">
                                            <button
                                                className="coeur"
                                                // onClick={handleModifyClick}
                                                > ♥️ </button>
                                            </div>
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