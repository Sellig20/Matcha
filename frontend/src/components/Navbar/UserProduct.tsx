import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import "../../assets/styles/Navbar/UserProduct.css"
import { useProfile } from "./User/profileContext";
import { useNavigate, useParams } from "react-router-dom";
import { UserProfileInterface } from "./User/UserInterface";

const UserProduct: React.FC = () => {

    const [message, setMessage] = useState('');
    const profile = useProfile();
    const { isProfileComplete } = useProfile();

    const { idd } = useParams<{idd:string}>();
    const [user, setUser] = useState<UserProfileInterface | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(!!notification);

    const getProductProfile = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/userproduct/${idd}`)
            if (JSON.stringify(response.data.productProfile) !== JSON.stringify(user)) {
                setUser(response.data.productProfile); 
            }
        } catch (error) {
            setMessage(`UserProduct.tsx | Erreur frontend get product profile : ${error}`);
        }
    }

    const postViewsProfiles = async () => {
        try {
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/views`, {
                viewed_id: idd,
                viewed_first_name: user?.first_name,
                viewer_id: profile?.profile?.id,
                viewer_first_name: profile?.profile?.first_name,
            });
            setMessage(response.data.message);
            console.log("\n\nresponse ---> ", response.data.message);
            console.log("\n\nresponse ---> ", response.data);
        } catch (error) {
            setMessage(`UserProduct.tsx | Erreur frontend post views : ${error}`);
        }
    };

    const handleNavigate = () => {
        navigate(`/apiServeur/userprofile`);
    };

    const handleModifyClick = async () => {
        try {
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/likes`, {
                user_id: profile?.profile?.id,
                liked_user_id: idd,
                liker_user_id: profile?.profile?.id,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(`UserProduct.tsx | Erreur frontend post likes : ${error}`);
        }
    }

    useEffect(() => {
        const executeData = async () => {
            try {
                if (isProfileComplete === false) {
                    setNotification("Warning : You must fill your profile before going on");
                }
                else {
                    if (idd && profile.profile) {
                        await getProductProfile();
                        if (user) {
                            await postViewsProfiles();
                        }
                    }
                }
            } catch (error) {
                setMessage(`UserProduct.tsx | Erreur use effect : ${error}`);
            }
        }
        executeData();
    }, [idd, profile.profile, user]);

    return (
        <section className="gradient-custom">
            <div>
            {/* Affichage du message */}
            {message && <p style={{ color: 'red' }}>{message}</p>}
            </div>

            {notification && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{notification}</p>
                        <button className="btn-userproduct" onClick={handleNavigate}>OK</button>
                    </div>
                </div>
            )}
        <h1>tu mattes <span className="colorH1">{user?.first_name}</span> ! </h1>

        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-10 col-xl-80">

                    {/* <h3>1 il faudra la search bar ici</h3> */}
                    <div className="card shadow-2-strong" style={{ borderRadius: '60px', padding: '20px'}}> {/* box bleue */}
                    <div className="d-flex" style={{ gap: "20px" }}> {/*les deux boites verticales*/}

                            <div className="col-md-4" style={{ width: "300px"}}>{/*BOITE 1*/}
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '30px', width: '100%', height: '100%' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <p className="text-center"> photos du user que je matte</p>
                                    </div>
                                    <div className="d-flex justify-content-center mb-3">
                                    <button
                                        className="coeur"
                                        onClick={handleModifyClick}
                                        > ♥️ </button>
                                    </div>
                                </div>
                            </div>


                            <div className="d-flex flex-column" style={{ gap:"5px", flex: 1}}>{/*BOITE 2*/}

                                <div className="card shadow-2-strong mb-2" style={{ borderRadius: '30px', width: '100%', height: '100%', paddingLeft: "10px" }}>
                                    <div className="d-flex flex-row">
                                        <div className="card-body" style={{ flex: 1 }}>
                                            <p className="firstname" >
                                                {user?.first_name}, {user?.age} ans
                                            </p>
                                            <p className="main-fields">I live in :</p>
                                            <p className="text-up">---Paris---</p>
                                            <p className="main-fields">I look for :</p>
                                            <p className="text-up">{user?.sexual_interest}</p>
                                            <p className="main-fields"> I identify as :</p>
                                            <p className="text-up">{user?.gender}</p>
                                        </div>

                                        <div className="card-body" style={{ flex: 1}}>
                                            <p className="main-fields">My passions :</p>
                                                <br />
                                                <p className="text-up" style={{ textIndent: "60px" }}>{user?.tags_1}</p>
                                                <br />
                                                <p className="text-up" style={{ textIndent: "160px" }}>{user?.tags_2}</p>
                                                <br />
                                                <p className="text-up" style={{ textIndent: "100px" }}>{user?.tags_3}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card shadow-2-strong mb-2" style={{ borderRadius: "30px", width: "100%", height: '100%', paddingLeft: "10px" }}>{/*BOITE 2*/}
                                        <div className="card-body">
                                        <p className="firstname" style={{ fontSize: "40px" }}> 🗨️ Bio : </p>
                                        <p className="text-up" style={{ fontSize: "30px" }}>{user?.biography}</p>
                                        </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}

export default UserProduct;