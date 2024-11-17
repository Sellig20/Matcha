import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import { useForm } from './useForm';
import { genderEnum, sexualInterestEnum, tagsEnum } from './UserInterface';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './profileContext';
import "../../../assets/styles/Navbar/User/UserProfile.css";
import { useWebSocketContext } from '../../../security/wsContext';
import axios from 'axios';

const UserProfile: React.FC = () => {
    const [message, setMessage] = useState('');
    const [formValues, handleChange] = useForm({ usersettingsid: '', username: '', age: '', age_lower_bound: '', age_upper_bound: '', gender: '', sexual_interest: '', biography: '', tags_1: '', tags_2: '', tags_3: ''});
    const navigate = useNavigate();
    const { fetchProfile } = useProfile();
    const { socket } = useWebSocketContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/userprofile`, formValues);
            setMessage(response.data.message);
            if (response.data) {
                // await fetchProfile();
                navigate('/apiServeur/userprofile/display');
            }
        } catch (error) {
            setMessage(`UserProfile.tsx | Erreur frontend userprofile : ${error}`);
        }
    };

    useEffect(() => {
        const res = fetchProfile();
    }, []);

    return (
        <section className="gradient-custom" >
        <div>
        <h1>Let us know more about you !</h1>
        </div>
        <div className="container py-5 h-100 ">
        <div className="row justify-content-center align-items-center h-100" >
        <div className="col-12 col-lg-9 col-xl-7">
        <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
        <div className="card-body p-4 p-md-5 ">
        {/* <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">My Profile</h3> */}

        <div className="bigBox-profile-display">
            <form onSubmit={handleSubmit}>
            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Username</label>
                </div>
                <div className="highlight-text-profile">
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
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Gender</label>
                </div>
                <div className="highlight-text-profile">
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
            </div>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Age</label>
                </div>
                <div className="highlight-text-profile">
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
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Minimum accepted age</label>
                </div>
                <div className="highlight-text-profile">
                <input
                    type="text" 
                    id="age_lower_bound"
                    className="form-control form-control-lg" 
                    value={formValues.age_lower_bound}
                    onChange={handleChange}
                    required
                />
                </div>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Maximal accepted age</label>
                </div>
                <div className="highlight-text-profile">
                <input
                    type="text" 
                    id="age_upper_bound"
                    className="form-control form-control-lg" 
                    value={formValues.age_upper_bound}
                    onChange={handleChange}
                    required
                />
                </div>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Sexual Interest</label>
                </div>
                <div className="highlight-text-profile">
                <select 
                    id="sexual_interest"
                    name="sexual_interest"
                    className="form-control form-control-lg" 
                    value={formValues.sexual_interest}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Sexual Interest</option>
                    {Object.values(sexualInterestEnum).map((sexual_interest) => (
                        <option key={sexual_interest} value={sexual_interest}>
                            {sexual_interest}
                        </option>
                    ))}
                </select>
                </div>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Biography</label>
                </div>
                <div className="highlight-text-profile">
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
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Tags 1</label>
                </div>
                <div className="highlight-text-profile">
                <select 
                    id="tags_1"
                    name="tags_1"
                    className="form-control form-control-lg" 
                    value={formValues.tags_1}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Tags</option>
                    {Object.values(tagsEnum).map((tag_1) => (
                        <option key={tag_1} value={tag_1}>
                            {tag_1}
                        </option>
                    ))}
                </select>
                </div>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Tags 2</label>
                </div>
                <div className="highlight-text-profile">
                <select 
                    id="tags_2"
                    name="tags_2"
                    className="form-control form-control-lg" 
                    value={formValues.tags_2}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Tags</option>
                    {Object.values(tagsEnum).map((tag_2) => (
                        <option key={tag_2} value={tag_2}>
                            {tag_2}
                        </option>
                    ))}
                </select>
                </div>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields fields-profile-display">
                <label>Tags 3</label>
                </div>
                <div className="highlight-text-profile">
                <select 
                    id="tags_3"
                    name="tags_3"
                    className="form-control form-control-lg" 
                    value={formValues.tags_3}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Tags</option>
                    {Object.values(tagsEnum).map((tag_3) => (
                        <option key={tag_3} value={tag_3}>
                            {tag_3}
                        </option>
                    ))}
                </select>
                </div>
            </div>
            </div>

            </div>

            <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
            <button data-mdb-ripple-init 
                        className="btn btn-lg" 
                    > Submit </button>
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