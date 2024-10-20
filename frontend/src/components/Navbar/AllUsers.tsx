import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";

const AllUSers: React.FC = () => {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState<{ id: number; name:string }[]>([]);

    const getListUsers = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/allusers`);
            console.log("\n\n\n REPONSE ALL USERS IS = ", response.data.list);
            setMessage(response.data.message);

            const filteredUsers = response.data.list.map((user: any) => ({
                id: user.id,
                name: user.first_name,
            }))
            
            setUsers(filteredUsers);
        } catch (error) {
            setMessage(`AllUsers.tsx | Erreur frontend allusers : ${error}`);
        }
    }

    useEffect(() => {
        getListUsers();
        const intervalId = setInterval(() => {
            getListUsers();
        }, 10000); 
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1>
                AllUSers of the app --- sera supprimee
            </h1>
            <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {message && <p>{message}</p>}
        </div>
    )
}

export default AllUSers;