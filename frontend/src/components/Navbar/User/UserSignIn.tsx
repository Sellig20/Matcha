import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/Navbar/User/UserSignin.css'
import { useAuth } from '../../../security/useAuth';
import { useForm } from './useForm';
import { useProfile } from './profileContext';
import axiosInstance from '../../../security/axiosInstance';

const UserSignIn: React.FC = () => {
    const { checkAuth } = useAuth();
    const { isProfileComplete, fetchProfile, profile } = useProfile();
    const [message, setMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState('');
    const [formValues, handleChange] = useForm({email: '', password: '' });
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        try {
            const response = await axiosInstance.post('http://localhost:8000/apiServeur/signin', formValues);
            setMessage(response.data.message);

            if (response.data.message) {
                sessionStorage.setItem('token', response.data.token);
                checkAuth();
                const isPC = await fetchProfile();
                if (!isPC) {
                    console.log(`userSignin.tsx -> ${profile?.id}is authenticated and profile is UNcompleted please fill your profile`);
                    navigate('/apiServeur/userprofile');
                }
                else {
                    console.log(`userSignin.tsx -> profile ${profile?.id} is completed let's go to matcha`);
                    navigate(`/apiServeur/mymatchaprofile/${profile?.id}`);
                }
            }
        } catch (error) {
            setMessage(`UserSignin.tsx | Erreur frontend signin : ${error}`);
        }
    };

    useEffect(() => {
        
    }, [isProfileComplete, profile]);

    return (
        <section className="gradient-custom" >
        <div>
        <h1> Sign in ! </h1>
        </div>
        <div className="container py-5 h-100 ">
            <div className="row justify-content-center align-items-center h-100" >
            <div className="col-12 col-lg-9 col-xl-7">
                <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
                <div className="card-body p-4 p-md-5 ">
                    
                    <form onSubmit={handleSubmit}>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-card form-outline-signin">
                            <div className="fields fields-signup">
                            <label className="form-label" htmlFor="emailAddress">Email</label>
                            </div>
                            <div className="high highlight-text-signin">
                            <input 
                                type="email" 
                                id="email" 
                                className="form-control form-control-lg" 
                                value={formValues.email} 
                                onChange={handleChange}
                                required 
                            />
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-card form-outline-signin">
                            <div className="fields fields-signup">
                            <label className="form-label" htmlFor="passwordAddress">Password</label>
                            </div>
                            <div className="high highlight-text-signin">
                            <input 
                                type="password" 
                                id="password" 
                                className="form-control form-control-lg" 
                                value={formValues.password} 
                                onChange={handleChange}
                                required 
                            />
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                        <button data-mdb-ripple-init 
                            className="btn btn-lg" 
                        > Submit </button>
                    </div>
                    {message && <p>{message}</p>}
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    )
};

export default UserSignIn;