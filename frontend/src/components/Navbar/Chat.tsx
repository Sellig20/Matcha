import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';

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
    return (
        <div>
            <h1>
                CHAT PAGE
            </h1>
        </div>
    )
}

export default Chat;