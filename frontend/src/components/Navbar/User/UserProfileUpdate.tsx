import React, { useState } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import { genderEnum, sexualInterestEnum, tagsEnum } from './UserInterface';
import { useForm } from './useForm';
import { useProfile } from './profileContext';
import { useNavigate } from 'react-router-dom';

const UserProfileUpdate: React.FC = () => {

    const [message, setMessage] = useState('');
    const { profile , fetchProfile } = useProfile();
    const [formValues, handleChange] = useForm({ usersettingsid: '', username: profile?.user_name || '', age: profile?.age || 0, gender: profile?.gender || '', sexual_interest: profile?.sexual_interest || '', biography: profile?.biography || '', tags_1: profile?.tags_1 || '', tags_2: profile?.tags_2 || '', tags_3: profile?.tags_3 || '' });
    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`http://localhost:8000/apiServeur/userprofile`, formValues);
            setMessage(response.data.message);
            if (response.data) {
                await fetchProfile();
                navigate('/apiServeur/userprofile/display');
            }
        } catch (error) {
            setMessage(`UserProfileUpdate.tsx | Erreur frontend userprofileUPDATE : ${error}`);
        }
    };

    return (
        <section className="gradient-custom" >
        <div>
        <h1>🩵 Modify your informations ! 🩵</h1>
        </div>
        <div className="container py-5 h-100 ">
        <div className="row justify-content-center align-items-center h-100" >
        <div className="col-12 col-lg-9 col-xl-7">
        <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
        <div className="card-body p-4 p-md-5 ">

        <div className="bigBox-profile-display">

        <div>
            <form onSubmit={handleSubmit}>
            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields-profile-display">
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
                <div className="fields-profile-display">
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
                <div className="fields-profile-display">
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
                <div className="fields-profile-display">
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
                <div className="fields-profile-display">
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
                <div className="fields-profile-display">
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
                <div className="fields-profile-display">
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
                <div className="fields-profile-display">
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
                    className="btn btn-info btn-lg" 
                    style={{ color: 'violet', fontFamily: "posterable"}}
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
        </div>
        </section>
    )
}

export default UserProfileUpdate;