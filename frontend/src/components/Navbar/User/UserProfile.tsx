import React, { useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import { useForm } from './useForm';
import { genderEnum, sexualInterestEnum, tagsEnum } from './UserInterface';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './profileContext';

const UserProfile: React.FC = () => {
    //user profile donc reprendre la table en bbdd,
    //l'afficher,
    //avoir la possibilite de la modifier
    // const { isAuthenticated, checkAuth } = useAuth();
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [formValues, handleChange] = useForm({ usersettingsid: '', username: '', age: '', gender: '', sexualInterest: '', biography: '', tags: '' });
    const navigate = useNavigate();
    const { fetchProfile } = useProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("\n\n\nbefooooore axiosInstance");
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/userprofile`, formValues);
            setMessage(response.data.message);
                console.log("UserProfile.tsx | enter your profile preferences");
                console.log("\n\n\nressssssponse data ", response.data);
            if (response.data) {
                console.log("\n\n je vais pour navigate\n\n");
                await fetchProfile();
                navigate('/apiServeur/userprofile/display');
            }
        } catch (err) {
            setMessage(`UserProfile.tsxxxxx | Erreur frontend userprofile : ${err}`);
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axiosInstance.get(`http://localhost:8000/apiServeur/userprofile`);
    //             console.log("data de userprofile.tsx --> ", response);
    //             setData(response.data);
    //             setMessage(response.data.message);
    //         } catch (error) {
    //             console.error('userprofile.tsx | Error fetching home data', error);
    //         }
    //     };

    //     // fetchData();

    // }, []);

    return (
        <section className="gradient-custom" >
        <div className="container py-5 h-100 ">
        <div className="row justify-content-center align-items-center h-100" >
        <div className="col-12 col-lg-9 col-xl-7">
        <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
        <div className="card-body p-4 p-md-5 ">
            <h2>Welcome, please fill your informations </h2>
        <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">My Profile</h3>

        <div>
            <form onSubmit={handleSubmit}>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                    <label>Username</label>
                    <input 
                        type="text" 
                        id="username"
                        className="form-control form-control-lg" 
                        value={formValues.username}
                        onChange={handleChange}
                        required
                    />
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Gender</label>
                <select
                    id="gender"
                    name="gender"
                    className="form-control form-control-lg" 
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
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>age</label>
                <input 
                    type="text" 
                    id="age"
                    className="form-control form-control-lg" 
                    value={formValues.age}
                    onChange={handleChange}
                    required
                />
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Sexual Interest</label>
                <select 
                    id="sexualInterest"
                    name="sexualInterest"
                    className="form-control form-control-lg" 
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
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Biography</label>
                <textarea
                    id="biography"
                    name="biography"
                    className="form-control form-control-lg" 
                    value={formValues.biography}
                    onChange={handleChange}
                    required
                />
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Tags</label>
                <select 
                    id="tags"
                    name="tags"
                    className="form-control form-control-lg" 
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
            </div>
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
        </div>
        </div>
        </div>
        </div>
        </div>
        </section>
    )
}

export default UserProfile;