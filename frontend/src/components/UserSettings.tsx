import { useEffect, useState } from 'react';
import axios from 'axios';
import UserSettingsInterface from './UserInterface';
import { useParams } from 'react-router-dom';

const UserSettings: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserSettingsInterface | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/apiUsers/${userId}');
                setUser(res.data);
            } catch (error) {
                console.error('Erreur pour recup userSettings AXIOS FRONTEND');
            }
        };
        fetchUser();
    }, [id]);

    if (!user)
    return <div> Chargement...</div>

    return (
        <div>
            <h1>
                {user.userName} {user.age}
            </h1>
            <p>Email : {user.biography}</p>
        </div>
    );
}

export default UserSettings;