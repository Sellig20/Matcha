import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import "../../assets/styles/Navbar/UserProduct.css"
import { useProfile } from "./User/profileContext";
import { useNavigate, useParams } from "react-router-dom";
import { UserProfileProduct } from "./User/UserInterface";

const UserProduct: React.FC = () => {

    const [message, setMessage] = useState('');
    const profile = useProfile();
    const { isProfileComplete } = useProfile();

    const { idd } = useParams<{idd:string}>();
    const [user, setUser] = useState<UserProfileProduct | null>(null);
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
                viewer_first_name: profile?.profile?.first_name
            });
            setMessage(response.data.message);
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
        
        {/* {notification && (<div className="alert-warning" role="alert"> 
            <a
                onClick={() => handleNavigate()}//wtf
                className="alert-warning"> 
                    {notification}
            </a>
        </div>)} */}
            {notification && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{notification}</p>
                        <button className="btn-userproduct" onClick={handleNavigate}>OK</button>
                    </div>
                </div>
            )}
        <div>UserProduct, donc la fiche des produits = des profils de l'app pour que moi en tant que user je DRAGUE</div>
        <h1>tu mattes <span className="colorH1">{user?.first_name}</span> ! </h1>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-12 col-xl-80">
                    <h3>1 il faudra la search bar ici</h3>
                    <div className="card shadow-2-strong" style={{ borderRadius: '20px', padding: '20px', height: '600px' }}>
                    <h3>2</h3>
                    <div className="row h-100">

                            {/* Rectangle vertical à gauche */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                <h3>3 ...</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center"> photos du user que je matte</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Rectangles horizontaux à droite */}
                            <div className="col-md-8 d-flex flex-column justify-content-between">
                                {/* Premier rectangle horizontal */}
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '20px', height: '48%' }}>
                                <h3>4 ...</h3>
                                    <div className="card-body">
                                        <p> AGE : 
                                            <br />
                                            {user?.age}
                                            <br />
                                            <br />
                                        </p>
                                        <p> SEXUAL INTERESTS : 
                                            <br />
                                            {user?.sexual_interest}
                                            <br />
                                            <br />
                                        </p>
                                        <p> GENDER : 
                                            <br />
                                            {user?.gender}
                                            <br />
                                        </p>
                                    </div>
                                </div>

                                {/* Deuxième rectangle horizontal */}
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', height: '48%' }}>
                                <h3>5 ...</h3>
                                    <div className="card-body">

                                        <p> BIOGRAPHY : 
                                            <br />
                                            {user?.biography}
                                            <br />
                                            <br />
                                        </p>
                                            <button data-mdb-ripple-init 
                                                className="coeur btn btn-info btn-lg"
                                                onClick={handleModifyClick}
                                            > 🩷 </button>
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