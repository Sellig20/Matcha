import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/Chat.css"
import { useProfile } from './User/profileContext';
import { all } from 'axios';
import { useNavigate } from 'react-router';
import { stripVTControlCharacters } from 'util';
import { useForm } from './User/useForm';
import { useWebSocketContext } from '../../security/wsContext';
import { isTypedArray } from 'util/types';

interface MatchaUser {
    id: number;
    name: string;
}

const Chat = () => {
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState('');
    const { isProfileComplete } = useProfile();
    const [formValues, setFormValues] = useState("");
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationNoMatch, setNotificationNoMatch] = useState<string | null>(null);
    const [tabAllMatchas, setAllMatchas] = useState<MatchaUser[]>([]);
    const [array, setArray] = useState<any[]>([]);
    const [chronoArray, setChronoArray] = useState<any[]>([]);
    const [profile_to_check_id, setProfileToCheck] = useState<number>();
    const [displayConv, setDisplayConv] = useState<boolean>(false);
    const navigate = useNavigate();
    const messagesRef = useRef<HTMLDivElement | null>(null);
    const { socket } = useWebSocketContext();

    //get my info
    const profile = useProfile();

    const getMatchasUsers = async () => {
        try {
            const myId = profile?.profile?.id;
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchasbdd`, {
                params: { matcher_id: myId },
            });
            if (response.data.TheyMatchedMe && response.data.IMatchedThem) {
                const TheyMatchedMe = response.data.TheyMatchedMe
                .map((item:any) => ({
                    id: item.matcher_user_id,
                    name: item.my_name,
                }));
                const IMatchedThem = response.data.IMatchedThem
                .map((item:any) => ({
                    id: item.matched_user_id,
                    name: item.matched_name,
                }));
                const tmp1 = TheyMatchedMe.filter((item: any) => item.id !== myId);
                const tmp2 = IMatchedThem.filter((item: any) => item.id !== myId);
                setArray([...tmp1, ...tmp2]);
            } else if (response.data.TheyMatchedMe) {
                const TheyMatchedMe = response.data.TheyMatchedMe
                .map((item:any) => ({
                    id: item.matcher_user_id,
                    name: item.my_name,
                }));
                const tmp1 = TheyMatchedMe.filter((item: any) => item.id !== myId);
                setArray([...tmp1]);
            } else if (response.data.IMatchedThem) {
                const IMatchedThem = response.data.IMatchedThem
                .map((item:any) => ({
                    id: item.matched_user_id,
                    name: item.matched_name,
                }));
                const tmp2 = IMatchedThem.filter((item: any) => item.id !== myId);
                setArray([...tmp2]);
            }
            else if (!response.data.TheyMatchedMe && !response.data.IMatchedThem) {
                setNotificationNoMatch("You have to match with someone to start a conversation !");
            }
            
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
        // console.log(`\n je veux la conv avec ${profile_to_register_id} !`);
        setProfileToCheck(profile_to_register_id);
    };

    // console.log("profile to check id var globale = ", profile_to_check_id);

    const handleClickCheckProfile = (profile_to_check_id: number | undefined) => {
        // console.log(`going to see ${profile_to_check_id} profile`);
        navigate(`/apiServeur/userproduct/${profile_to_check_id}`);
    };

    // const handleChangeMsg = () => {
    //     setFormValues(formValues);
    // };

    const scrollToBottom = () => {
        if (messagesRef.current) {
          messagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sortMsgChrono = (myMessages: any, itsMessages: any) => {
        let sampleChronoArray = [];
        let i = 0;
        let j = 0;
        console.log("\n\n\n^^^^^^^^^^^^^^\n jarrive en sortMsgChrono avec : ", myMessages, "-------", itsMessages);
        console.log("avec comme i = ", i, "-------- et j = ", j);
        console.log("^^^^^^^^^^^^^^\n\n\n")
        while (i < myMessages.length && j < itsMessages.length) {
            const myCurrentSentOn = new Date(myMessages[i].sent_on);
            const itsCurrentSentOn = new Date(itsMessages[j].sent_on);
            // console.log("\n\n moi -> ", myMessages[i].message, "à -> ", myCurrentSentOn, 
            //     " \n|\n its -> ", itsMessages[j].message, "à -> ", itsCurrentSentOn);
            if (myCurrentSentOn < itsCurrentSentOn || !itsCurrentSentOn) {
                sampleChronoArray.push({
                    message : myMessages[i].message,
                    date : myCurrentSentOn,
                    id : 1,
                })
                // console.log(" >>>>>>>>>>>> ", myMessages[i].message, " <<<<<<<<<<< ");
                i++;
            } else if (itsCurrentSentOn < myCurrentSentOn || !myCurrentSentOn) {
                sampleChronoArray.push({
                    message : itsMessages[j].message,
                    date : itsCurrentSentOn,
                    id : 2,
                })
                // console.log(" >>>>>>>>>>>> ", itsMessages[j].message, " <<<<<<<<<<< ");
                j++;
            }
            console.log(" >>>>>>> debug 1 >>>>>> ", sampleChronoArray);
        }
        while (i < myMessages.length) {
            sampleChronoArray.push({
                message : myMessages[i].message,
                date : new Date(myMessages[i].sent_on),
                id : 1,
            })
            i++;
            console.log(" >>>>>>> debug 2 >>>>>> ", sampleChronoArray);

        }
        while (j < itsMessages.length) {
            sampleChronoArray.push({
                message : itsMessages[j].message,
                date : new Date(itsMessages[j].sent_on),
                id : 2,
            })
            j++;
            console.log(" >>>>>>> debug 3 >>>>>> ", sampleChronoArray);

        }
        console.log("chrono array is => ", sampleChronoArray);
        return sampleChronoArray;
        // setChronoArray((prevSCA) => [...prevSCA, sampleChronoArray]);

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/chatmessages`, {
                sender_id: profile?.profile?.id,
                receiver_id: profile_to_check_id,
                message: formValues,
            });
            setFormValues("");

            const itsMessages = response.data.itsMsg;
            const myMessages = response.data.myMsg;
            const sca = sortMsgChrono(myMessages, itsMessages);
            // setChronoArray(sca);
            setChronoArray((prev) => prev.concat(sca));
        } catch (error) {
            setMessage(`Chat.tsx | Erreur frontend post text messages chat : ${error}`);
        }
    };
    
    // const getTextFor2 = async () => {
    //     try {
            
    //     } catch (error) {
    //         console.log(`Chats.tsx | Error get text message for 2 : ${error}`);
    //     }
    // }

    useEffect(() => {
        try {
            if (isProfileComplete === false) {
                setNotification("Warning : You must fill your profile before going on");
            }
            else {
                getMatchasUsers();
                if (socket) {
                    socket.on('send_messages_both', (tabMyMsg, tabsItsMsg) => {
                        console.log("***** SOCKET BOTH ******\n tabmymsg = ", tabMyMsg, "\ntabitsmsg = ",tabsItsMsg);
                        const sca = sortMsgChrono(tabMyMsg.tabMyMsg, tabsItsMsg.tabItsMsg);
                        // setChronoArray(sca);
                        console.log("$$$$$$$ sca => ", sca);
                        // setChronoArray((prevSCA) => [...prevSCA, sca]);
                        setChronoArray((prev) => prev.concat(sca));
                        // console.log("------ 1 ----> chrono array === ", chronoArray);

                    });
                    
                    socket.on('send_messages_me', (tabMyMsg) => {
                        console.log("**** SOCKET ME *******\n tabmymsg = ", tabMyMsg);
                        const sca = sortMsgChrono(tabMyMsg,  chronoArray.filter(m => m.id === 2));
                        // setChronoArray(sca);
                        // setChronoArray((prevSCA) => [...prevSCA, sca]);

                        // console.log("------ 2 ----> chrono array === ", chronoArray);
                        setChronoArray((prev) => prev.concat(sca));
                        
                    });
                    
                    socket.on('send_messages_its', (tabsItsMsg) => {
                        console.log("***** SOCKET ITS ******\n tabitsmsg = ",tabsItsMsg);
                        const sca = sortMsgChrono(chronoArray.filter(m => m.id === 1), tabsItsMsg);
                        // setChronoArray(sca);
                        // setChronoArray((prevSCA) => [...prevSCA, sca]);

                        // console.log("------ 3 ----> chrono array === ", chronoArray);
                        setChronoArray((prev) => prev.concat(sca));

                    })
                    scrollToBottom();
                    return () => {
                        socket.off('send_messages_both');
                        socket.off('send_messages_me');
                        socket.off('send_messages_its');
                    }
                }
            }
        } catch (error) {
            setNotification(`Erreur frontend userprofile : ${error}`);
        }
    }, [profile_to_check_id, socket, chronoArray]);

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
            <div>
                {message && <p style={{ color: 'red' }}>{message}</p>}
            </div>
            
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
                                                            profile_to_check_id === user.id ? 'td-chat-clicked' : 'td-chat'
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
                                <div className="card-body corpus-bubble">

                                    <div className="historic-texts">
                                        {chronoArray.map((msg, index) => (
                                            <div
                                                className={
                                                   msg.id == 1 ? 'bubble-me' : 'bubble-its'
                                                }
                                                key={index}
                                                >
                                                <div className="da-chat">{msg.message}</div>
                                            </div>
                                        ))}
                                        <div ref={messagesRef}></div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="bubble-to-chat">
                                            <input 
                                                className="textearea-bubble"
                                                id="msg"
                                                name="msg"
                                                value={formValues}
                                                type="text"
                                                onChange={(e) => setFormValues(e.target.value)}
                                                // required
                                                >
                                            </input>
                                        </div>
                                        <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                                            <button data-mdb-ripple-init 
                                                className="btn btn-chat btn-send"
                                                // onClick={handleChangeMsg}
                                                type="submit"
                                                > Send </button>
                                        </div>
                                    </form>
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
                                                    onClick={() => handleClickCheckProfile(profile_to_check_id)}>
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


