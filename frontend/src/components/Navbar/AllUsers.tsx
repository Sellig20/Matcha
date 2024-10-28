import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../security/wsContext";
import "../../assets/styles/index.css"

const AllUSers: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<string[]>([]);
    const [socketUsers, setSocketUsers] = useState<string[]>([]);
    const navigate = useNavigate();
    const { socket } = useWebSocketContext();
    
    const getListUsers = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/allusers`);
            setMessage(response.data.message);
            setMyId(response.data.myId);
            setUsers(response.data.list);
        } catch (error) {
            setMessage(`AllUsers.tsx | Erreur frontend allusers : ${error}`);
        }//quand je viens de la bdd il y a du retard 10s + time out pour le nouvel user seulement
    }

    const handleNavigate = (userid: string) => {
        navigate(`/apiServeur/userproduct/${userid}`);
    };

    
    useEffect(() => {
        
        getListUsers();
        if (socket) {
            // const emitMessage = () => {
            //     const message = 'Hello from frontend!';
            //     socket.emit('messagerie', message);
            // };
            
            // const emitMessageCoucou = () => {
            //     const message = 'Coux couc!';
            //     socket.emit('coucou', message);
            // };

            // socket.emit('newUser');
            socket.on('newUser', (updateUsers) => {
                setUsers(updateUsers);
            })
            
            // socket.on('coucoux', (msg) => {
            //     console.log("Alluser.tsx ca :", msg);
            // })
            
            // // emitMessage();
            // emitMessageCoucou();
            
            return () => {
                socket.off('message');
                socket.off('newUser');
            };
        } else {
            console.error('La socket n est pas connecté.');
        }
    }, [socket]);
    
    return (
        <div>
            <h1>Liste des profils</h1>
            <table style={{ margin: '50px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((userId) => (
                        <tr key={userId}>
                            <td
                                onClick={() => handleNavigate(userId)}
                                style={{ cursor: 'pointer', border: '1px solid black', padding: '8px' }}
                            >
                                {userId}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AllUSers;