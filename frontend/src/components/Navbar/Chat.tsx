import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/Chat.css"
import { useProfile } from './User/profileContext';

const Chat = () => {
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState('');
    
    //get my info
    const profile = useProfile();

    const getMatchasUsers = async () => {
        try {
            const myId = profile?.profile?.id;
            console.log("\n profile?.profile?.id ", profile?.profile?.id);
            console.log("\n myId ", myId);
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchasbdd`, {
                params: { matcher_id: myId },
            });
            console.log("\n\n matchas from bdd -> ", response);
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who viewed me : ${error}`);
        }
    }

    useEffect(() => {
        getMatchasUsers();

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
                                <div className="card-body d-flex justify-content-center align-items-center">
                                    <p>Liste de toutes mes convos</p>
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
                                <div className="card shadow-2-strong mb-3 justify-content-center align-items-center" style={{ borderRadius: "30px", width: "100%", height: "100%" }}>
                                    <div className="card-body d-flex-column justify-content-center align-items-center">
                                        <div className="card-body card-picture-2-c">
                                            ///photo de maxence////
                                        </div>
                                        <p>Aller sur son profile</p>
                                        <p>Report</p>
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


