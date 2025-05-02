import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/Chat.css"
import { useProfile } from './User/profileContext';
import { useNavigate } from 'react-router';
import { useWebSocketContext } from '../../security/wsContext';

interface MatchaUser {
    id: number;
    name: string;
}

const Chat = () => {
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState('');
    const { isProfileComplete } = useProfile();
    const [formValues, setFormValues] = useState("");
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationNoMatch, setNotificationNoMatch] = useState<string | null>(null);
    const [array, setArray] = useState<any[]>([]);
    const [chronoArray, setChronoArray] = useState<any[]>([]);
    const [profile_to_check_id, setProfileToCheck] = useState<number>();
    const [displayConv, setDisplayConv] = useState<boolean>(false);
    const navigate = useNavigate();
    const messagesRef = useRef<HTMLDivElement | null>(null);
    const { socket } = useWebSocketContext();

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
        setProfileToCheck(profile_to_register_id);
    };


    const handleClickCheckProfile = (profile_to_check_id: number | undefined) => {
        navigate(`/apiServeur/userproduct/${profile_to_check_id}`);
    };

    const scrollToBottom = () => {
        if (messagesRef.current) {
          messagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isUserAtBottom = () => {
        if (messagesRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
          return scrollTop + clientHeight >= scrollHeight - 10;
        }
        return false;
    };

    const sortMsgChrono = (myMessages: any, itsMessages: any) => {
        let sampleChronoArray = [];
        let i = 0;
        let j = 0;
        while (myMessages && itsMessages && i < myMessages.length && j < itsMessages.length) {
            const myCurrentSentOn = new Date(myMessages[i].sent_on);
            const itsCurrentSentOn = new Date(itsMessages[j].sent_on);
            if (myCurrentSentOn < itsCurrentSentOn || !itsCurrentSentOn) {
                sampleChronoArray.push({
                    message : myMessages[i].message,
                    date : myCurrentSentOn,
                    id : 1,
                })
                i++;
            } else if (itsCurrentSentOn < myCurrentSentOn || !myCurrentSentOn) {
                sampleChronoArray.push({
                    message : itsMessages[j].message,
                    date : itsCurrentSentOn,
                    id : 2,
                })
                j++;
            }
        }
        while (myMessages && i < myMessages.length) {
            sampleChronoArray.push({
                message : myMessages[i].message,
                date : new Date(myMessages[i].sent_on),
                id : 1,
            })
            i++;
        }
        while (itsMessages && j < itsMessages.length) {
            sampleChronoArray.push({
                message : itsMessages[j].message,
                date : new Date(itsMessages[j].sent_on),
                id : 2,
            })
            j++;
        }
        return sampleChronoArray;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/chatmessages`, {
                sender_id: profile?.profile?.id,
                receiver_id: profile_to_check_id,
                message: formValues,
            });
            // await getHistoricChat();
        } catch (error) {
            setMessage(`Chat.tsx | Erreur frontend post text messages chat : ${error}`);
        }
    };
    
    useEffect(() => {
        try {
            if (isProfileComplete === false) {
                setNotification("Warning : You must fill your profile before going on");
            }
            else {
                getMatchasUsers();
                if (profile_to_check_id) {
                }
                if (isUserAtBottom()) {
                    scrollToBottom();
                }
                let userId = profile?.profile?.id;
                let interlocuteur_id = profile_to_check_id;
                if (userId && interlocuteur_id) {
                    const roomId = [userId, interlocuteur_id].sort().join("-");
                    setRoomId(roomId);
                }
                if (socket) {
                    if (roomId) {
                        socket.emit("joinRoom", roomId);
                    }

                    socket.on("newMessage", (message: any) => {
                        setChronoArray((prev) => [...prev, message]);
                    })
                    
                    return () => {
                    }
                }
            }
        } catch (error) {
            setNotification(`Erreur frontend userprofile : ${error}`);
        }
    }, [socket]);

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
                                                   msg.id == 1 ? 'bubble-chat me' : 'bubble-chat its'
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
                                                >
                                            </input>
                                        </div>
                                        <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                                            <button data-mdb-ripple-init 
                                                className="btn btn-chat btn-send"
                                                type="submit"
                                                > Send </button>
                                        </div>
                                    </form>
                                </div>
                                </div>

                            </div>

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


