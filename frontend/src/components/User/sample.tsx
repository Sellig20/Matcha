import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserSettingsInterface } from './UserInterface';
import { useParams } from 'react-router-dom';

const Sample: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserSettingsInterface[] | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/apiServeur/${id}`);
                setUser(res.data);
            } catch (error) {
                console.error('sample.tsx | Erreur pour recup userSettings AXIOS FRONTEND');
            }
        };
        fetchUser();
    }, [id]);

    if (!user)
    return <div> Chargement...</div>

    return (
        <div>
            <h1>
                bonjour
                {user[0].firstname} {user[0].lastname}
            </h1>
            <p>password : {user[0].pass_word}</p>
        </div>
    );
}

export default Sample;