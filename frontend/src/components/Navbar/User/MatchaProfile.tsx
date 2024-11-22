import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import "../../../assets/styles/Navbar/User/MatchaProfile.css"
import { useProfile } from './profileContext';
import { useNavigate, useParams } from 'react-router-dom';
import { UserProfileInterface } from './UserInterface';

const MatchaProfile: React.FC = () => {

    const { fetchProfile } = useProfile();
    const [message, setMessage] = useState('');
    const [messageNewMatch, setMessageNewMatch] = useState('');
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
            if (users == null) {
                setMessageNewMatch("Sorry... no new matchas today !");
            } else {
                setMessageNewMatch("New match !");
            }
            console.log("\n\n users =>> Match users >>>> ", response.data.listName, "\n\n");
        } catch (error) {
            setMessage(`MatchaProfile.tsx | Erreur frontend get  : ${error}`);
        }
    }

    const handleNavigateNotification = () => {
        navigate(`/apiServeur/userprofile`);
    };

    const handleClickHeart = () => {
        console.log("\n\nI clicked the heart\n\n");
    };

    const handleClickPrevious = () => {
        if (currentIndex > 0 && currentIndex <= users.length - 1) {
            setCurrentIndex(currentIndex - 1);
            setMessageNewMatch("New match !");
        } else {
            setMessageNewMatch("Sorry, no more matchas for today !");
        }
    }

    const handleClickNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setMessageNewMatch("New match !");
        } else {
            setMessageNewMatch("Sorry, no more matchas for today !");
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
            setNotification(`Erreur frontend userprofile : ${error}`);
        }
    }, [])
    //il faut les sockets pour render des que jarrive sur la page.

    return (
        <section className="gradient-custom">
        <div>
        <h1>Hello <span className="colorH1">{profile.profile?.first_name}</span> ! </h1>

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
                    <div className="card shadow-2-strong" style={{ borderRadius: '60px', padding: '20px'}}>
                    <div className="d-flex" style={{ gap: "20px" }}> {/*les deux boites verticales*/}

                            {/* Rectangle vertical à gauche */}
                            <div className="col-md-4" style={{ width: "300px"}}>
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '30px', width: '100%', height: '100%' }}>
                                <h3> MON PROFIL </h3>
                                    <div className="card-body card-picture-1">
                                        <p> ///PHOTO de moi////</p>
                                    </div>
                                    <div className="card-body my-side-profile">
                                        <p><span style={{fontFamily: "memories"}}> {profile?.profile?.first_name}, {profile?.profile?.age} years old, Paris</span></p>
                                        <p>I'm looking for : <span style={{fontFamily: "memories"}}> {profile?.profile?.sexual_interest}</span></p>
                                        <p> I am : <span style={{fontFamily: "memories"}}>{profile?.profile?.gender}</span></p>
                                        <button className="button-matcha-profile">change my profile</button>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column" style={{ gap:"5px", flex: 1}}>{/*BOITE 2*/}
                                <div 
                                    className={`card-body align-items-center animation-new-match ${
                                        messageNewMatch === "New match !" ? "NewMatch" : "NoMatch"
                                      }`}>
                                    {messageNewMatch && <p>{messageNewMatch}</p>}
                                </div>
                                <div className="card shadow-2-strong mb-2" style={{ borderRadius: '30px'}}>
                                    <div className="d-flex flex-row" style={{}}>
                                        <div className="card-body" style={{ border:"solid 4px brown"}}>
                                           {/* <p>HELLO TODAY WE FOUND YOU :</p>
                                            */}
                                           <div className="card-body d-flex flex-column firstname"
                                                key={users[currentIndex]?.id}>
                                                {users[currentIndex]?.user_name}, {users[currentIndex]?.age} yo
                                            </div>
                                                Paris
                                                {users[currentIndex]?.tags_1}

                                                tag 1 <br /> tags 2 <br /> tag3 <br /> 
                                                biography si et genderrrr
                                                <p className="firstname"> 🗨️ Bio : </p>
                                                <p className="text-up" style={{ fontSize: "30px" }}>{users[currentIndex]?.biography}</p>
                                        </div>

                                        <div className="card-body" style={{ flex: 1}}>
                                            <div className="card-body card-picture-2"
                                            // style={{width: "100%", height: "100%"}}
                                            >
                                                <p> ///PHOTO du match suggested////</p>
                                            </div>
                                            <div className="button-picture" style={{ border:"solid 4px brown", width: "400px", height: "100px"}}>
                                                <button
                                                    className="button-prev-next button-matcha-profile"
                                                    // onClick={() => handleClickPrevious()}
                                                    >previous picture
                                                </button>
                                                <button
                                                    className="button-prev-next button-matcha-profile"
                                                    // onClick={() => handleClickNext()}
                                                    >next picture
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                        <div 
                                            className="card-body d-flex align-items-center justify-content-center"
                                            >
                                </div>

                                <div className="shadow-2-strong mb-2" style={{ borderRadius: "30px", width: "100%", height: '100%', paddingLeft: "10px" }}>
                                    <div className="d-flex align-items-center justify-content-center" style={{ border: "solid 2px purple"}}>
                                        <div className="d-flex justify-content-center mb-3 flex-row" style={{ border: "solid 2px grey"}}>
                                        <div className="" style={{ border: "solid 2px red"}}>
                                            <button
                                                className="button-prev-next button-matcha-profile"
                                                onClick={() => handleClickPrevious()}
                                                >⇠ previous match
                                            </button>
                                            <button
                                                className="heart"
                                                onClick={handleClickHeart}
                                                >  
                                            </button>
                                            <button
                                                className="button-prev-next button-matcha-profile"
                                                onClick={() => handleClickNext()}
                                                > next match ⇢
                                            </button>
                                            </div>
                                        </div>
                                    </div>
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