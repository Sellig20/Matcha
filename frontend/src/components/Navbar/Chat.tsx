import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/Chat.css"

const Chat = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/apiServeur/checktok`);
                setData(response.data);
            } catch (error) {
                console.error('userSettings.tsx | Error fetching home data', error);
            }
        };

        fetchData();
    }, []);

    //liste des utilisateurs en ligne
    // 1 room = 2 personnes qui ont matche
    // post les messages en bdd
    // <- socket et res ->
    // get les anciens messages
    //les afficher en bulles frontend





    return (
        <div>
            <h1>
                CHAT PAGE
            </h1>
        </div>
    )
}

export default Chat;