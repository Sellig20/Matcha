import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/Chat.css"
import { useProfile } from './User/profileContext';
import { all } from 'axios';
import { useNavigate } from 'react-router';

interface MatchaUser {
    id: number;
    name: string;
}

const Chat = () => {
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState('');
    const { isProfileComplete } = useProfile();
    const [notification, setNotification] = useState<string | null>(null);
    const [tabAllMatchas, setAllMatchas] = useState<MatchaUser[]>([]);
    const navigate = useNavigate();

    //get my info
    const profile = useProfile();

    const getMatchasUsers = async () => {
        try {
            const myId = profile?.profile?.id;
            console.log("\n myId ", myId);
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchasbdd`, {
                params: { matcher_id: myId },
            });
            console.log("\n\n I matched them -> ", response.data.IMatchedThem);
            console.log("They matched me -> ", response.data.TheyMatchedMe, "\n\n");
            // const IMatchedThem = response.data.IMatchedThem;
            // const TheyMatchedMe = response.data.TheyMatchedMe;
            const IMatchedThem = response.data.IMatchedThem.map((item: any) => ({
                id: item.matched_user_id,
                name: item.matched_name,
            }));
    
            const TheyMatchedMe = response.data.TheyMatchedMe.map((item: any) => ({
                id: item.matcher_user_id,
                name: item.my_name,
            }));
            

            const allMatchas = [...IMatchedThem, ...TheyMatchedMe];
            setAllMatchas(allMatchas);
            // console.log("chat all matchas = ", allMatchas);
            // for (let i = 0; i < tabAllMatchas.length; i ++) {
            //     console.log("\n ----------> ", tabAllMatchas[i].name);
            // }
            // console.log("\n\n list users / matchs available to chat with ===> ", allMatchas);
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who viewed me : ${error}`);
        }
    }

    const handleNavigateNotification = () => {
        navigate(`/apiServeur/userprofile`);
    };

    useEffect(() => {
        try {
            if (isProfileComplete === false) {
                setNotification("Warning : You must fill your profile before going on");
            }
            else {
                getMatchasUsers();
                
            }
    } catch (error) {
        setNotification(`Erreur frontend userprofile : ${error}`);
    }

    }, []);

    //liste des utilisateurs en ligne avec qui jai matche avec qui je parle
    //get matchas pour la liste de ceux a qui je peux parler et display une liste sur le cote gauche
    //creer une zone d'entree de texte qui permet en cliauqnt sur "envoyer" de la "monter" au-dessus dans une bulle de conv
    
    //enregistrer chaque message dans la table message
    
    // 1 room = 2 personnes qui ont matche
    // post les messages en bdd
    // <- socket et res ->
    // get les anciens messages
    //les afficher en bulles frontend

    return (
            <section className="gradient-custom">
            {/* <div>
                {message && <p style={{ color: 'red' }}>{message}</p>}
            </div> */}
            
            <div>
                <h1>
                    CHAT PAGE
                </h1>
            </div>

            {notification && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{notification}</p>
                        <button className="btn-userproduct" onClick={handleNavigateNotification}>OK</button>
                    </div>
                </div>
            )}

            <div className="container py-5 h-100">
                <div className="d-flex row justify-content-center align-items-center h-100">
                    {/* Grand carré */}
                    <div className="col-12 col-xl-80">
                    <div className="card shadow-2-strong" style={{ borderRadius: "60px"}}>
                        <div className="d-flex justify-content-between align-items-start p-4">


                            {/* Rectangle vertical à gauche */}
                            <div className="col-md-3"style={{ height:"500px", width:"330px" }}>
                                <div
                                className="card shadow-2-strong mb-3"style={{ borderRadius: "30px", width: "100%", height: "100%" }}>
                                    <div className="card d-flex justify-content-center align-items-center">
                                        <p>Liste de toutes mes convos</p>
                                        <p>Afficher les conv MAIS AUSSI les gens AVEC QUI je PEUX avoir une conv</p>
                                    </div>
                                    <div>
                                        <table className="table-fm">
                                            <thead>
                                                <tr>
                                                    <th className="th-fm">WHO ?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            <ul>
                                                {tabAllMatchas.map((user) => (
                                                    <li>{user.name}</li>
                                                ))}
                                            </ul>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                            {/* Deux carrés superposés */}
                            <div className="d-flex flex-column mx-3" style={{ width: "40%" }}>
                                <div className="card shadow-2-strong mb-3"style={{ borderRadius: "30px", height: "150px",}}>
                                <div className="d-flex align-items-center gap-3 px-3" style={{ height: "100%" }}>
                                    <div className="card-picture-1-c">
                                            ///photo de maxence////
                                    </div>
                                    <p>Max</p>
                                </div>
                                </div>

                                <div className="card shadow-2-strong"style={{ borderRadius: "30px", width: "100%", height: "330px" }}>
                                <div className="card-body d-flex justify-content-center align-items-center">
                                    <p>messagerie et messages</p>
                                </div>
                                </div>
                            </div>


                            {/* Rectangle vertical à droite */}
                            <div className="col-md-3"style={{ height:"500px", width:"330px" }}>
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: "30px", width: "100%", height: "100%" }}>
                                    <div className="card-body d-flex-column">
                                            <div className="card card-picture-2-c">
                                                ///photo de maxence////
                                            </div>
                                            <div className="card button-chat"
                                            >
                                                <div>
                                                    <button className="button-prev-next button-matcha-profile">
                                                    <p>Aller sur son profil</p>
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="button-prev-next button-matcha-profile">
                                                    <p>Report</p>
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
    )
}

export default Chat;


