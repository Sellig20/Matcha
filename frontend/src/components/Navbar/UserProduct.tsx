import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import { useProfile } from "./User/profileContext";
import { useParams } from "react-router-dom";

const UserProduct: React.FC = () => {

    //l'id recup => l'id que je vais recupe en bdd
    const [message, setMessage] = useState('');
    const profile = useProfile();
    const { idd } = useParams<{idd:string}>();
    const [user, setUser] = useState<{ id: number; first_name:string }>();

    const getProductProfile = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/userproduct/${idd}`)
            setUser(response.data.productProfile[0]);
            console.log("|", profile?.profile?.first_name,"| matte", response.data.productProfile[0].first_name, "( id :", response.data.productProfile[0].id, ")");
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
            setUser(response.data.productProfile[0]);
            // console.log("|", profile?.profile?.first_name,"| matte", response.data.productProfile[0].first_name, "( id :", response.data.productProfile[0].id, ")");
        } catch (error) {
            setMessage(`UserProduct.tsx | Erreur frontend post views : ${error}`);
        }
    }

    useEffect(() => {
        try {
            getProductProfile();
            postViewsProfiles();
        } catch (error) {
            setMessage(`UserProduct.tsx | Erreur use effect : ${error}`);
        }
    }, [profile, idd, user]);

    return (
        <section className="gradient-custom">
        <div>UserProduct, donc la fiche des produits = des profils de l'app pour que moi en tant que user je DRAGUE</div>
        <h1>tu mattes <span className="colorH1">{user?.first_name}</span> ! </h1>
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
                                <h3>3 ...</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle Vertical</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Rectangles horizontaux à droite */}
                            <div className="col-md-8 d-flex flex-column justify-content-between">
                                {/* Premier rectangle horizontal */}
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: '20px', height: '48%' }}>
                                <h3>4 ...</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 1</h3>
                                    </div>
                                </div>

                                {/* Deuxième rectangle horizontal */}
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', height: '48%' }}>
                                <h3>5 ...</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 2</h3>
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