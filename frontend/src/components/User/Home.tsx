import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance'; // Importez l'instance configurée d'Axios

const Home: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/home');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching home data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {data ? <div>Welcome Home: {JSON.stringify(data)}</div> : <div>Loading...</div>}
        </div>
    );
};

export default Home;
