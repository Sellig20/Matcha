import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import "../../../assets/styles/Navbar/User/MatchaProfile.css"
import { useProfile } from './profileContext';
import { useNavigate, useParams } from 'react-router-dom';
import { UserProfileInterface } from './UserInterface';

const MatchaProfile: React.FC = () => {

    const { fetchProfile } = useProfile();
    const [message, setMessage] = useState('');
    const { idd } = useParams<{idd:string}>();
    const [messageNewMatch, setMessageNewMatch] = useState('');
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<UserProfileInterface[]>([]);
    const { isProfileComplete } = useProfile();
    const [notification, setNotification] = useState<string | null>(null);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isClickedHeart, setIsClickedHeart] = useState<boolean>(false);

    //get my informations
    const profile = useProfile();
    //get Matchs informations
    const getSuggestedMatch = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchsusers`);
            setMessage(response.data.message);
            setMyId(response.data.myId);
            setUsers(response.data.listName);
            if (response.data.listName == null || response.data.listName.length == 0) {
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

    const handleClickHeart = async() => {
        console.log("\n\nI clicked the heart\n\n");
        try {
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/likes`, {
                user_id: profile?.profile?.id,
                liked_user_id: users[currentIndex]?.id,//pas bon
                liker_user_id: profile?.profile?.id,
            });
            setMessage(response.data.message);
            setIsClickedHeart(true);
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
    //link to all my matched and suggestions and suggestions = userproduct possibility to like and matched = user product heart clicked
    const handleClickKnowMore = (userid: string) => {
        navigate(`/apiServeur/userproduct/${userid}`);
    }

    function truncateBio(biography: string) {
        if (!biography)
            return null;
        const words = biography.split(" ");
        return words.slice(0, 2).join(" ") + (words.length > 2 ? "..." : " ");
    }

    useEffect(() => {
        try {
            console.log("\n is heart cliecked ? ", isClickedHeart);

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
    const i = 0;
    if (users[i] == null)
        console.log("\ncaca caca caca\n")
    else {
        console.log("==> users ? = ", users);
    }

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
                                        <p>
                                            <p className="main-fields-mp-1 button-change"
                                            style={{fontSize: "30px"}}
                                            > {profile?.profile?.user_name}, {profile?.profile?.age} yo</p>
                                        </p>
                                        <p className="main-fields-mp-1"> I am :</p>
                                            <p className="text-up-mp">{profile?.profile?.gender}</p>
                                        <p className="main-fields-mp-1"> I live in :</p>
                                            <p className="text-up-mp">Pariiiis</p>
                                        <p className="main-fields-mp-1">I'm looking for :</p>
                                            <p className="text-up-mp">{profile?.profile?.sexual_interest}</p>
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

                                      {users[i] != null ? (

                                        <div className="card-body">
                                           <div className="card-body d-flex flex-column firstname"
                                                key={users[currentIndex]?.id}>
                                                {users[currentIndex]?.user_name}, {users[currentIndex]?.age} yo
                                            </div>
                                                <p className="text-up">
                                                    📍Paris
                                                </p>
                                                <p className="main-fields">Hobbies</p>
                                                    <p className="text-up"
                                                    style={{ textIndent: "120px", margin:"10px"}}
                                                    >
                                                        {users[currentIndex]?.tags_1}
                                                    </p>
                                                    <p className="text-up"
                                                    style={{ textIndent: "60px", padding:"15px"}}
                                                    >
                                                        {users[currentIndex]?.tags_2}
                                                    </p>
                                                    <p className="text-up"
                                                    style={{ textIndent: "160px", padding:"15px"  }}
                                                    >
                                                        {users[currentIndex]?.tags_3}
                                                    </p>
                                                <p className="main-fields">Gender</p>
                                                    <p className="text-up">
                                                        {users[currentIndex]?.gender}
                                                    </p>
                                                <p className="main-fields">Interested by </p>
                                                    <p className="text-up">
                                                        {users[currentIndex]?.sexual_interest}
                                                    </p>
                                                    <br /><br />
                                                <p className="firstname-bio"> 🗨️ Bio : </p>
                                                <p className="text-up-bio">{truncateBio(users[currentIndex]?.biography)}</p>
                                        </div>

                                      ) : (

                                        <div className="card-body">
                                           <div className="card-body d-flex flex-column firstname"
                                                key={users[currentIndex]?.id}
                                                >
                                                ...
                                            </div>
                                                <p className="text-up">
                                                    ...
                                                </p>
                                                <p className="main-fields">Hobbies</p>
                                                    <p className="text-up"
                                                    style={{textIndent: "120px", margin:"10px"}}
                                                    >
                                                        ...
                                                    </p>
                                                    <p className="text-up"
                                                    style={{textIndent: "60px", padding:"15px"}}
                                                    >
                                                        ...
                                                    </p>
                                                    <p className="text-up"
                                                    style={{textIndent: "160px", padding:"15px"}}
                                                    >
                                                        ...
                                                    </p>
                                                <p className="main-fields">Gender</p>
                                                    <p className="text-up">
                                                        ...
                                                    </p>
                                                <p className="main-fields">Interested by </p>
                                                    <p className="text-up">
                                                        ...
                                                    </p>
                                                    <br /><br />
                                                <p className="firstname-bio"> 🗨️ Bio : </p>
                                                <p className="text-up-bio" style={{fontSize: "50px"}}>...</p>
                                        </div>


                                      )}

                                        <div className="card-body sug-match-picture" style={{flex: 1}}>
                                            <div className="card-body card-picture-2">
                                                <p> ///PHOTO du match suggested////</p>
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
                                    // style={{ border: "solid 2px purple"}}
                                    >
                                        <div className="d-flex button-like" 
                                            style={{display: "flex", alignItems:"center", justifyContent:"center"}}
                                        >
                                            <button
                                                className="button-prev-next button-matcha-profile"
                                                onClick={() => handleClickPrevious()}
                                                >⇠ previous match
                                            </button>
                                            {!isClickedHeart ? 
                                            <button
                                                className="heart"
                                                onClick={handleClickHeart}
                                                >
                                            </button>
                                             : 
                                            <button
                                                className="heart-clicked"
                                                // onClick={handleClickHeart}
                                                >
                                            </button>
                                            }
                                            <button
                                                className="button-prev-next button-matcha-profile"
                                                // style={{ border: "solid 2px red"}}
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