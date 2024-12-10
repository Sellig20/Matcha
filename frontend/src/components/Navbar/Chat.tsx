import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/Chat.css"
import { useProfile } from './User/profileContext';
import { all } from 'axios';
import { useNavigate } from 'react-router';
import { stripVTControlCharacters } from 'util';
import { useForm } from './User/useForm';

interface MatchaUser {
    id: number;
    name: string;
}

const Chat = () => {
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState('');
    const { isProfileComplete } = useProfile();
    const [formValues, handleChange] = useForm({ msg: ''});
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationNoMatch, setNotificationNoMatch] = useState<string | null>(null);
    const [tabAllMatchas, setAllMatchas] = useState<MatchaUser[]>([]);
    const [array, setArray] = useState<MatchaUser[]>([]);
    const [profile_to_check_id, setProfileToCheck] = useState<number>();
    const [displayConv, setDisplayConv] = useState<boolean>(false);
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
            if (response.data.TheyMatchedMe) {
                const TheyMatchedMe = response.data.TheyMatchedMe.map((item: any) => ({
                    id: item.matcher_user_id,
                    name: item.my_name,
                }));
                setArray(TheyMatchedMe);
            }
            else if (!response.data.TheyMatchedMe || !array || array.length < 0) {
                setNotificationNoMatch("You have to match with someone to start a conversation !");
            }
            console.log("\n\n array -> ", array);
            console.log("\n\n length IMATCHED THEM ----> ", array.length);

            // const IMatchedThem = response.data.IMatchedThem.map((item: any) => ({
            //     id: item.matched_user_id,
            //     name: item.matched_name,
            // }));
            
            
            
            // const allMatchas = [...IMatchedThem, ...TheyMatchedMe];
            // setAllMatchas(allMatchas);
            
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who viewed me : ${error}`);
        }
    }

    const handleNavigateNotification = () => {
        navigate(`/apiServeur/userprofile`);
    };

    const handleNoMatchNotification = () => {
        setNotificationNoMatch(null);
    };

    const handleClickConv = (profile_to_register_id: number) => {
        setDisplayConv(true);
        console.log(`\n je veux la conv avec ${profile_to_register_id} !`);
        setProfileToCheck(profile_to_register_id);
    };
    console.log("profile to check id var globale = ", profile_to_check_id);

    const handleClickCheckProfile = (profile_to_check_id: string) => {
        console.log(`going to see ${profile_to_check_id}`);
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
                        {notification}
                        <button className="btn-userproduct" onClick={handleNavigateNotification}>OK</button>
                    </div>
                </div>
            )}
            {notificationNoMatch && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {notificationNoMatch} 
                        <button className="btn-userproduct" onClick={handleNoMatchNotification}>OK</button>
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
                            <div className="discussions col-md-3"style={{ height:"500px", width:"330px", borderRadius: "30px" }}>
                                        <table className="table-chat">
                                            <thead>
                                                <tr className="tr-chat">
                                                    <th className="th-chat">Discussions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {array.map((user) => (
                                                    <tr key={user.id}
                                                        onClick={() => handleClickConv(user.id)}
                                                        className={
                                                            displayConv === true ? 'td-chat-clicked' : 'td-chat'
                                                        }>
                                                        <td className="td-chat">{user.name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                            </div>

                            {displayConv ? (
                            <>
                            {/* Deux carrés superposés */}
                            <div className="d-flex flex-column mx-3" style={{ width: "40%" }}>

                                <div className="card shadow-2-strong mb-3"style={{ borderRadius: "30px", height: "150px",}}>
                                <div className="d-flex align-items-center gap-3 px-3" style={{ height: "100%" }}>
                                    <div className="card-picture-1-c">
                                            ///photo user : {profile_to_check_id}////
                                    </div>
                                    <p>Max</p>
                                </div>
                                </div>

                                <div className="card shadow-2-strong"style={{ borderRadius: "30px", width: "100%", height: "330px" }}>
                                <div className="card-body bubble-corpus">
                                    <div className="historic-texts">
                                    <p>old messages</p>

                                    </div>
                                    <div className="bubble-to-chat">
                                        <textarea 
                                            className="textearea-bubble"
                                            id="bubble-chat"
                                            value={formValues.msg}
                                            onChange={handleChange}
                                            required
                                            >
                                        </textarea>
                                    </div>
                                    <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                                        <button data-mdb-ripple-init 
                                            className="btn btn-chat" 
                                            > Send </button>
                                    </div>
                                </div>
                                </div>

                            </div>


                            {/* Rectangle vertical à droite */}
                            <div className="col-md-3"style={{ height:"500px", width:"330px" }}>
                                <div className="card shadow-2-strong mb-3" style={{ borderRadius: "30px", width: "100%", height: "100%" }}>
                                    <div className="card-body d-flex-column">
                                            <div className="card card-picture-2-c">
                                                ///photo user : {profile_to_check_id}////
                                            </div>
                                            <div className="card button-chat"
                                            >
                                                <div>
                                                    <button
                                                    className="button-chat-text"
                                                    onClick={() => handleClickCheckProfile("null")}>
                                                        Check this juicy profile !
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="button-chat-text">
                                                        <p>Report</p>
                                                    </button>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            </>

                            ) : (
                                //si oas de clique sur display conversation

                            <>
                            <div className="d-flex flex-column mx-3" style={{ width: "40%" }}>
                                <div className="no-chat-up card shadow-2-strong mb-3"style={{ borderRadius: "30px", height: "150px",}}>
                                    No profile loaded ...
                                </div>

                                <div className="no-chat card shadow-2-strong"style={{ borderRadius: "30px", width: "100%", height: "330px" }}>
                                <div className=" card-body d-flex justify-content-center align-items-center">
                                    No conversation loaded...
                                </div>
                                </div>
                            </div>


                            {/* Rectangle vertical à droite */}
                            <div className="col-md-3"style={{ height:"500px", width:"330px" }}>
                                <div className="no-chat card shadow-2-strong mb-3" style={{ borderRadius: "30px", width: "100%", height: "100%" }}>
                                   No profile loaded ...
                                </div>
                            </div>

                            </>
                            )}

                        </div>
                    </div>
                    </div>
                </div>
            </div>
            
    </section>
    )
}

export default Chat;


