import { useEffect, useState } from "react";
import axiosInstance from "../../security/axiosInstance";

const AllUSers: React.FC = () => {
    const [message, setMessage] = useState('');

    const getListUsers = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/allusers`);
            console.log("\n\n\n REPONSE ALL USERS IS = ", response.data.list);
            
            setMessage(response.data.message);
        } catch (error) {
            setMessage(`AllUsers.tsx | Erreur frontend allusers : ${error}`);
        }
    }

    useEffect(() => {
        getListUsers();
    }, []);

    return (
        <div>
            <h1>
                AllUSers of the app --- sera supprimee
            </h1>
        </div>
    )
}

export default AllUSers;