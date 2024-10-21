import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const AllUSers: React.FC = () => {
    const [message, setMessage] = useState('');
    const [myId, setMyId] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<{ id: number; name:string }[]>([]);
    const navigate = useNavigate();
    
    const getListUsers = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/allusers`);
            console.log("\n\n\n REPONSE ALL USERS IS = ", response.data.list);
            setMessage(response.data.message);
            
            const filteredUsers = response.data.list.map((user: any) => ({
                id: user.id,
                name: user.first_name,
            }))
            
            setMyId(response.data.myId);
            setUsers(filteredUsers);
        } catch (error) {
            setMessage(`AllUsers.tsx | Erreur frontend allusers : ${error}`);
        }
    }

    const handleNavigate = (userid: number) => {
        console.log("Je m'envole voir le profil de : ", userid);
        navigate(`/apiServeur/userproduct/${userid}`);
    };

    useEffect(() => {
        getListUsers();
        const intervalId = setInterval(() => {
            getListUsers();
        }, 1000); 
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1>All Users of the App</h1>
            {message && <p>{message}</p>}

            <div className="col-md-8 d-flex align-items-center justify-content-center">
                <table className="table table-striped table-bordered table-hover shadow-sm">
                    <thead className="thead-dark">
                        <p>je suis {myId}</p>
                        <tr>
                            <th>ID dans l'ordre du dernier connecte</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>
                                    {user.id !== myId && (
                                    <button
                                        data-mdb-ripple-init
                                        className="btn btn-info btn-lg"
                                        style={{ color: 'violet', fontFamily: "posterable" }}
                                        onClick={() => handleNavigate(user.id)}
                                    >
                                        Voir profil de {user.id}
                                    </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllUSers;