import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';

const UserProfile: React.FC = () => {
    //user profile donc reprendre la table en bbdd,
    //l'afficher,
    //avoir la possibilite de la modifier
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/apiServeur/checktok`);
                console.log("data de userprofile.tsx --> ", response);
                setData(response.data);
                setMessage(response.data.message);
            } catch (error) {
                console.error('userprofile.tsx | Error fetching home data', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            <h1>
                USER PROFILE BABE
            </h1>
        {message && <p>{message}</p>}
        </div>

    )
}

export default UserProfile;