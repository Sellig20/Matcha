import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import "../../../assets/styles/Navbar/User/MatchaProfile.css"
import { useProfile } from './profileContext';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { UserProfileInterface } from './UserInterface';
import { clear } from 'console';
import { useWebSocketContext } from '../../../security/wsContext';
import { useForm } from './useForm';

const MatchaProfile: React.FC = () => {

    const { fetchProfile } = useProfile();
    const [message, setMessage] = useState('');
    const [messageNewMatch, setMessageNewMatch] = useState('');
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<UserProfileInterface[]>([]);
    const { isProfileComplete } = useProfile();
    const [notification, setNotification] = useState<string | null>(null);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isClickedHeart, setIsClickedHeart] = useState(false);
    const { socket } = useWebSocketContext();

    //get my informations
    const profile = useProfile();

    //get Matchs informations
   

    const getSuggestedMatch = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchsusers`); // proposer des profils interessants
            setMessage(response.data.message);
            setMyId(response.data.myId);
            if (response.data.success === "false" 
                || response.data === undefined 
                || response.data === null
            ) {
                setMessageNewMatch("Sorry... no new matchas today !");
            } else {
                setMessageNewMatch("New match !");
                setUsers(response.data.tab);
                setIsClickedHeart(response.data.tab.alreadyLike)
            }
            console.log("\n\n Match users -> ", response.data.tab[0], "\n\n");
        } catch (error) {
            setMessage(`MatchaProfile.tsx | Erreur frontend get  : ${error}`);
        }
    }

    const getMatcha = async () => {
        try {
            const myId = profile?.profile?.id;
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchasbdd`, {
                params: { matcher_id: myId },
            });
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who viewed me : ${error}`);
        }
    }

    const handleNavigateNotification = () => {
        navigate(`/apiServeur/userprofile`);
    };

    const handleClickHeart = async() => {
        try {
            setIsClickedHeart(true);
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/likes`, {
                user_id: profile?.profile?.id,
                liked_user_id: users[currentIndex]?.id,//pas bon
                liker_user_id: profile?.profile?.id,
                params: { the_id: profile?.profile?.id },
            });
            if (response.data.success) {
                // setIsClickedHeart("true");
                setMessage(response.data.message);
            } else {
                // setIsClickedHeart("false");
                setMessage("\nErreur : Impossible d'enregistrer le like.");
            }
        } catch (error) {
            setMessage(`UserProduct.tsx | Erreur frontend post likes : ${error}`);
        }
    };

    const handleDisclickHeart = async() => {
        try {
            setIsClickedHeart(false);
            console.log("handle disclick heart\n");
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/dislikes`, {
                user_id: profile?.profile?.id,
                liked_user_id: users[currentIndex]?.id,
                liker_user_id: profile?.profile?.id,

            })
        } catch (error) {
            setMessage(`UserProduct.tsx | Erreur frontend post likes : ${error}`);
        }
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
    const handleClickKnowMore = (userid: string) => {
        navigate(`/apiServeur/userproduct/${userid}`);
    }

    function truncateBio(biography: string) {
        if (!biography)
            return null;
        if (biography[i] == " ") {
            const words = biography.split(" ");
            return words.slice(0, 2).join(" ") + (words.length > 2 ? "..." : " ");
        }
        else {
            return biography.slice(0, 25) + '...'
        }
    }

    useEffect(() => {
        const executeData = async () => {
                try {
                    if (isProfileComplete === false) {
                        setNotification("Warning : You must fill your profile before going on");
                    }
                    else {
                        fetchProfile();
                        await getSuggestedMatch();
                        if (users.length > 0) {
                            getMatcha();
                        };
                        if (socket) {
                            socket.on('updateAlreadyLike', (valueToUpdate: boolean) => {
                                setIsClickedHeart(valueToUpdate);
                            })
                        }
                    }
            } catch (error) {
                setNotification(`Erreur frontend userprofile : ${error}`);
            }
        }
        executeData();

        return () => {
            socket?.off('newMatchUserMP');
        }
    }, [socket])

    const i = 0;
    const currentUser = users[currentIndex];

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
        <div className="container py-4 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-12 col-xl-80">
                    <div className="card shadow-2-strong" style={{ borderRadius: '60px', padding: '20px'}}>
                    <div className="d-flex" style={{ gap: "20px" }}> {/*les deux boites verticales*/}

                            {/* Rectangle vertical à gauche */}
                            <div className="col-md-4" style={{ width: "300px"}}>
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '30px', width: '100%', height: '100%' }}>
                                {/* <h3> MON PROFIL </h3> */}
                                    <div className="card-body d-flex card-picture-1">
                                        <p> ///PHOTO de moi////</p>
                                    </div>
                                    <div className="card-body my-side-profile">
                                        <div>
                                            <div className="main-fields-mp-1 button-change"
                                            style={{fontSize: "30px"}}
                                            > {profile?.profile?.user_name}, {profile?.profile?.age} yo</div>
                                        </div>
                                        <div className="main-fields-mp-1"> I am :</div>
                                            <div className="text-up-mp">{profile?.profile?.gender}</div>
                                        <div className="main-fields-mp-1"> I live in :</div>
                                            <div className="text-up-mp">Pariiiis</div>
                                        <div className="main-fields-mp-1">I'm looking for :</div>
                                            <div className="text-up-mp">{profile?.profile?.sexual_interest}</div>
                                            <br />
                                            <br />
                                            <div className="button-change">
                                            <button className="button-matcha-profile button-prev-next">
                                                change my profile
                                            </button>
                                        </div>
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
                                <div className="card shadow-2-strong" 
                                style={{ borderRadius: '30px'}}
                                >
                                    <div className="d-flex flex-row" style={{}}>

                                      {currentUser ? (

                                        <div className="card-body">
                                           <div className="card-body d-flex flex-column firstname"
                                                key={users[currentIndex]?.id}>
                                                {users[currentIndex]?.user_name}, {users[currentIndex]?.age} yo
                                            </div>
                                                <div className="text-up">
                                                    📍Paris
                                                </div>
                                                <div className="main-fields">Hobbies</div>
                                                    <div className="text-up"
                                                    style={{ textIndent: "120px", margin:"10px"}}
                                                    >
                                                        {users[currentIndex]?.tags_1}
                                                        {users[currentIndex]?.alreadyLike}
                                                    </div>
                                                    <div className="text-up"
                                                    style={{ textIndent: "60px", padding:"15px"}}
                                                    >
                                                        {users[currentIndex]?.tags_2}
                                                    </div>
                                                    <div className="text-up"
                                                    style={{ textIndent: "160px", padding:"15px"  }}
                                                    >
                                                        {users[currentIndex]?.tags_3}
                                                    </div>
                                                <div className="main-fields">Gender</div>
                                                    <div className="text-up">
                                                        {users[currentIndex]?.gender}
                                                    </div>
                                                <div className="main-fields">Interested by </div>
                                                    <div className="text-up">
                                                        {users[currentIndex]?.sexual_interest}
                                                    </div>
                                                    <br /><br />
                                                <div className="firstname-bio"> 🗨️ Bio : </div>
                                                <div className="text-up-bio">{truncateBio(users[currentIndex]?.biography)}</div>
                                        </div>

                                      ) : (

                                        <div className="card-body">
                                           <div className="card-body d-flex flex-column firstname"
                                                key={users[currentIndex]?.id}
                                                >
                                                ...
                                            </div>
                                                <div className="text-up">
                                                    ...
                                                </div>
                                                <div className="main-fields">Hobbies</div>
                                                    <div className="text-up"
                                                    style={{textIndent: "120px", margin:"10px"}}
                                                    >
                                                        ...
                                                    </div>
                                                    <div className="text-up"
                                                    style={{textIndent: "60px", padding:"15px"}}
                                                    >
                                                        ...
                                                    </div>
                                                    <div className="text-up"
                                                    style={{textIndent: "160px", padding:"15px"}}
                                                    >
                                                        ...
                                                    </div>
                                                <div className="main-fields">Gender</div>
                                                    <div className="text-up">
                                                        ...
                                                    </div>
                                                <div className="main-fields">Interested by </div>
                                                    <div className="text-up">
                                                        ...
                                                    </div>
                                                    <br /><br />
                                                <div className="firstname-bio"> 🗨️ Bio : </div>
                                                <div className="text-up-bio" style={{fontSize: "50px"}}>...</div>
                                        </div>


                                      )}

                                        <div className="card-body sug-match-picture" style={{flex: 1}}>
                                            <div className="card-body card-picture-2">
                                                <div> ///PHOTO du match suggested////</div>
                                            </div>
                                            <div className="button-picture d-flex justify-content-center">
                                                <button
                                                    className="button-prev-next button-matcha-profile"
                                                    // onClick={() => handleClickPrevious()}
                                                    >⇠ previous picture
                                                </button>
                                                <button
                                                    className="button-prev-next button-matcha-profile"
                                                    // onClick={() => handleClickNext()}
                                                    >next picture ⇢
                                                </button>
                                            </div>
                                            <div className= "d-flex justify-content-center">
                                                <button
                                                    className="button-go-user-product"
                                                    onClick={() => handleClickKnowMore(String(users[currentIndex]?.id))}
                                                    >Com'on know more about me !
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                <div className="shadow-2-strong mb-2" 
                                style={{ borderRadius: "30px", width: "100%", height: '100%', paddingLeft: "10px"}}
                                >
                                    <div className="d-flex align-items-center justify-content-center" 
                                    >
                                        <div className="d-flex button-like" 
                                            style={{display: "flex", alignItems:"center", justifyContent:"center"}}
                                        >
                                            <button
                                                className="button-prev-next button-matcha-profile"
                                                onClick={() => handleClickPrevious()}
                                                >⇠ previous match
                                            </button>
                                            <div>
                                                <button
                                                className={`hearty ${(
                                                    users[currentIndex]?.alreadyLike === true
                                                    || isClickedHeart === true
                                                ) ? 'heart-clicked' : 'heart'}`}
                                                onClick={users[currentIndex]?.alreadyLike ? handleDisclickHeart : handleClickHeart}
                                                >
                                                ♥
                                                </button>
                                            </div>
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
                </div>
            </div>
        </div>
    </section>
)}

export default MatchaProfile;