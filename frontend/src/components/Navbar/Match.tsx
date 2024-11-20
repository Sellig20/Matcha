import '../../assets/styles/Navbar/Match.css'
import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../security/wsContext";
import "../../assets/styles/Navbar/Match.css"
import { useProfile } from "./User/profileContext";
import { UserProfileInterface } from './User/UserInterface';

const Match: React.FC = () => {
    const [message, setMessage] = useState('');
    const { isProfileComplete } = useProfile();
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<UserProfileInterface[]>([]);
    const navigate = useNavigate();
    const { socket } = useWebSocketContext();
    const [notification, setNotification] = useState<string | null>(null);

    const getListUsers = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchsusers`);
            setMessage(response.data.message);
            setMyId(response.data.myId);
            setUsers(response.data.listName);
            console.log("\n\n users =>> MATCH?S USERS >>>> ", response.data.listName, "\n\n");
            // console.log("\n\n i am ", profile);
        } catch (error) {
            setMessage(`AllUsers.tsx | Erreur frontend allusers : ${error}`);
        }
    }

    const handleNavigate = (userid: string) => {
        navigate(`/apiServeur/userproduct/${userid}`);
    };

    const handleNavigateNotification = () => {
        navigate(`/apiServeur/userprofile`);
    };
    
    useEffect(() => {

        const executeData = async () => {
            try {
                if (isProfileComplete === false) {
                    setNotification("Warning : You must fill your profile before going on");
                }
                else {
                    getListUsers();
                    if (socket) {
            
                        socket.on('newMatchUser', (listName) => {
                            console.log("\n\nje suis la socket");
                            setUsers(listName);
                        })
                        
                        return () => {
                            socket.off('message');
                            socket.off('newUser');
                        };
                    } else {
                        console.error('La socket n est pas connecté.');
                    }
                }
            } catch (error) {
                setMessage(`UserProduct.tsx | Erreur use effect : ${error}`);
            }
        }
        executeData();
        
    }, [socket]);
    
    return (
        

    <section className="gradient-custom">
        <div>
            {message && <p style={{ color: 'red' }}>{message}</p>}
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
            <div className="row justify-content-center align-items-center">
                {/* Grand carré */}
                <div className="biggy col-12 col-xl-80 d-flex justify-content-center">
                    <div className="card shadow-2-strong" style={{ borderRadius: '20px', padding: '20px', height: '100%', width: '100%' }}>
                        
                        {/* Jauge horizontale */}
                        <div className="progress mb-4" style={{ height: '30px' }}>
                           search bar
                        </div>

                        <div className="matchs-row row">
                            {/* Premier rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        
                                    <div>
                                    <h2 className="text-center">My suggested matchas</h2>

                                    <table className="table-matchs">
                                            <thead>
                                                <tr>
                                                    <th className="th-matchs">ID ?</th>
                                                    <th className="th-matchs">WHO ?</th>
                                                    <th className="th-matchs">AGE ?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {users.map((user, index) => (
                                                <tr key={`user-${index}`}>
                                                    <td className="td-matchs"
                                                        onClick={() => handleNavigate(user.id.toString())}>
                                                        {user.id}
                                                    </td>
                                                    <td className="td-matchs">
                                                        {user.user_name}
                                                    </td>
                                                    <td className="td-matchs">
                                                        {user.age}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                    </table>
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
    );
};

export default Match;