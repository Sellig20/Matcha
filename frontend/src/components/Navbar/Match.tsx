import '../../assets/styles/Navbar/Match.css'
import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../security/wsContext";
import "../../assets/styles/index.css"
import { useProfile } from "./User/profileContext";
import { UserProfileInterface } from './User/UserInterface';
import { UserCreate } from '../../../../backend/src/orm/schema';

const Match: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<UserProfileInterface[]>([]);
    const [usersNames, setUsersNames] = useState<string[]>([]);
    const navigate = useNavigate();
    const { socket } = useWebSocketContext();
    const profile = useProfile();
    
    const getListUsers = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/matchsusers`);
            setMessage(response.data.message);
            setMyId(response.data.myId);
            setUsers(response.data.listName);
            // setUsersNames(response.data.listName);
            console.log("\n\n users =>> MATCH?S USERS >>>> ", response.data.listName, "\n\n");
            // console.log("\n\n i am ", profile);
        } catch (error) {
            setMessage(`AllUsers.tsx | Erreur frontend allusers : ${error}`);
        }
    }

    // const handleNavigate = (userid: string) => {
    //     navigate(`/apiServeur/userproduct/${userid}`);
    // };
    
    useEffect(() => {
        
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
    }, [socket]);
    
    return (
        

    <section className="gradient-custom">
        <div>
            <h3>Structure avec une jauge et trois rectangles alignés horizontalement</h3>
        </div>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center">
                {/* Grand carré */}
                <div className="biggy col-12 col-xl-80 d-flex justify-content-center">
                    <div className="card shadow-2-strong" style={{ borderRadius: '20px', padding: '20px', height: '100%', width: '100%' }}>
                        
                        {/* Jauge horizontale */}
                        <div className="progress mb-4" style={{ height: '30px' }}>
                           search bar
                        </div>

                        <div className="fm-row row">
                            {/* Premier rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <h3 className="text-center">Rectangle 1 : VIEWS</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        
                                    <div>
                                    <h1>Liste des profils INTERESSANTS</h1>

                                    <table className="table-au">
                                            <thead>
                                                <tr>
                                                    <th className="th-fm">ID ?</th>
                                                    <th className="th-fm">WHO ?</th>
                                                    <th className="th-fm">AGE ?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {users.map((user, index) => (
                                                <tr key={`user-${index}`}>
                                                    <td
                                                        style={{ cursor: 'pointer', border: '1px solid black', padding: '8px' }}>
                                                        {user.id}
                                                    </td>
                                                    <td
                                                        style={{ border: '1px solid black', padding: '8px' }}>
                                                        {user.user_name}
                                                    </td>
                                                    <td
                                                        style={{ border: '1px solid black', padding: '8px' }}>
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