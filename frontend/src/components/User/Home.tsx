import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';

const Home: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axiosInstance.get('/home');
                // setData(response.data);
                console.log("\n dans home de user de components\n");
            } catch (error) {
                console.error('Error fetching home data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/* {data ? <div>Welcome Home: {JSON.stringify(data)}</div> : <div>Loading...</div>} */}
            <h1>HELLO HOME PAGE</h1>
        </div>
    );
};

export default Home;
