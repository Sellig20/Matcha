import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../security/wsContext";

const AllUSers: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<string[]>([]);
    const [socketUsers, setSocketUsers] = useState<{ id: number; name:string }[]>([]);
    const navigate = useNavigate();
    const { socket } = useWebSocketContext();
    
    const getListUsers = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/allusers`);
            console.log("\n\n\n REPONSE ALL USERS IS = ", response.data.list);
            setMessage(response.data.message);
            setMyId(response.data.myId);
            setUsers(response.data.list);
            console.log("\n\n\n voici les setUsers ==> ", users);
        } catch (error) {
            setMessage(`AllUsers.tsx | Erreur frontend allusers : ${error}`);
        }
    }

    const handleNavigate = (userid: number) => {
        console.log("Je m'envole voir le profil de : ", userid);
        navigate(`/apiServeur/userproduct/${userid}`);
    };

    
    useEffect(() => {
        
        if (socket) {//socket du coup useffect generees a chaque fois que composant
            console.log("coucoju la socket");
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
                console.log("\n\n UPDATR USERS ======> ", updateUsers);
                setUsers(updateUsers);
            })
            
            // socket.on('coucoux', (msg) => {
            console.log("\n\n\n voici les setSocketUsers ==> ", socketUsers);
            //     console.log("Alluser.tsx ca :", msg);
            // })
            
            // // emitMessage();
            // emitMessageCoucou();
            getListUsers();
            
            return () => {
                socket.off('message');
                // socket.off('newUser');
            };
        } else {
            console.error('La socket n est pas connecté.');
        }
    }, []);
    
    return (
        <div>
            <h1>Messages du serveur</h1>
            {users.map((user) => (
                <div key={user}>{user}</div>
            ))}
            </div>
    );
    // return (
    //     <div>
    //             {/* <p>je suis {myId}</p> */}
    //         <h1>All Users of the App</h1>
    //         {message && <p>{message}</p>}
    
    //         <div className="col-md-8 d-flex align-items-center justify-content-center">
    //             <table className="table table-striped table-bordered table-hover shadow-sm">
    //                 <thead className="thead-dark">
    //                     <tr>
    //                         <th>ID dans l'ordre du dernier connecte</th>
    //                         <th>Name</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {users.map((user) => (
    //                         <tr key={user.id}>
    //                             <td>{user.id}</td>
    //                             <td>{user.name}</td>
    //                             <td>
    //                                 {user.id !== myId && (
    //                                 <button
    //                                     data-mdb-ripple-init
    //                                     className="btn btn-info btn-lg"
    //                                     style={{ color: 'violet', fontFamily: "posterable" }}
    //                                     onClick={() => handleNavigate(user.id)}
    //                                 >
    //                                     Voir profil de {user.id}
    //                                 </button>
    //                                 )}
    //                             </td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         </div>
    //     </div>
    // );
}


export default AllUSers;