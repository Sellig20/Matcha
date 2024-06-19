import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';

const UserSettings: React.FC = () => {
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
            <h1>WELCOME USER SETTINGS</h1>
            {data ? <div>User: {JSON.stringify(data)}</div> : <div>Loading...</div>}
        </div>
    );
};

export default UserSettings;
