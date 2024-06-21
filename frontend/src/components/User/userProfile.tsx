import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import { useForm } from './useForm';
import axios from 'axios';
import { genderEnum, sexualInterestEnum, tagsEnum } from './userInterface';

const UserProfile: React.FC = () => {
    //user profile donc reprendre la table en bbdd,
    //l'afficher,
    //avoir la possibilite de la modifier
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [formValues, handleChange] = useForm({ username: '', age: '', gender: '', sexualInterest: '', biography: '', tags: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/apiServeur/signup', formValues);
            setMessage(response.data.message);
                console.log("UserProfile.tsx | enter your profile preferences");
        } catch (err) {
            setMessage("UserProfile.tsx | Erreur frontend signup");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/apiServeur/userprofile`);
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        id="username"
                        value={formValues.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>age</label>
                    <input 
                        type="text" 
                        id="age"
                        value={formValues.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formValues.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        {Object.values(genderEnum).map((gender) => (
                            <option key={gender} value={gender}>
                                {gender}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Sexual Interest</label>
                    <select 
                        id="sexualInterest"
                        name="sexualInterest"
                        value={formValues.sexualInterest}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Sexual Interest</option>
                        {Object.values(sexualInterestEnum).map((interest) => (
                            <option key={interest} value={interest}>
                                {interest}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Biography</label>
                    <input
                        id="biography"
                        name="biography"
                        value={formValues.biography}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Tags</label>
                    <select 
                        id="tags"
                        name="tags"
                        value={formValues.tags}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Tags</option>
                        {Object.values(tagsEnum).map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                        <input data-mdb-ripple-init 
                            className="btn btn-primary btn-lg" 
                            type="submit" 
                            value="Submit" />
                </div>

            </form>
        {message && <p>{message}</p>}
        </div>

    )
}

export default UserProfile;