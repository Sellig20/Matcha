import React, { useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import { useForm } from './useForm';
import { genderEnum, sexualInterestEnum, tagsEnum } from './UserInterface';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './profileContext';
import "../../../assets/styles/Navbar/User/UserProfile.css"

const UserProfile: React.FC = () => {
    const [message, setMessage] = useState('');
    const [formValues, handleChange] = useForm({ usersettingsid: '', username: '', age: '', gender: '', sexualInterest: '', biography: '', tags: '' });
    const navigate = useNavigate();
    const { fetchProfile } = useProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`http://localhost:8000/apiServeur/userprofile`, formValues);
            setMessage(response.data.message);
            if (response.data) {
                await fetchProfile();
                navigate('/apiServeur/userprofile/display');
            }
        } catch (error) {
            setMessage(`UserProfile.tsx | Erreur frontend userprofile : ${error}`);
        }
    };

    return (
        <section className="gradient-custom" >
        <div>
        <h1>🩵 Let us know more about you ! 🩵</h1>
        </div>
        <div className="container py-5 h-100 ">
        <div className="row justify-content-center align-items-center h-100" >
        <div className="col-12 col-lg-9 col-xl-7">
        <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
        <div className="card-body p-4 p-md-5 ">
        {/* <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">My Profile</h3> */}

        <div>
            <form onSubmit={handleSubmit}>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields-profile-display">
                <label>Username</label>
                </div>
                <div className="highlight-text">
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
                <div className="fields-profile-display">
                <label>Gender</label>
                </div>
                <div className="highlight-text">
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
                <div className="fields-profile-display">
                <label>Age</label>
                </div>
                <div className="highlight-text">
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
                <div className="fields-profile-display">
                <label>Sexual Interest</label>
                </div>
                <div className="highlight-text">
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
            </div>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields-profile-display">
                <label>Biography</label>
                </div>
                <div className="highlight-text">
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
                <div className="fields-profile-display">
                <label>Tags</label>
                </div>
                <div className="highlight-text">
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
            </div>

            <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                <input data-mdb-ripple-init 
                    className="btn-modify btn-info btn-lg" 
                    type="submit" 
                    value="Submit"
                    style={{ color: 'violet', fontFamily: 'trukin'}} />
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