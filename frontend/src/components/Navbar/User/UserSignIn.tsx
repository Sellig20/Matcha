import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/Navbar/User/UserSignin.css'
import { useAuth } from '../../../security/useAuth';
import { useForm } from './useForm';
import { useProfile } from './profileContext';

const UserSignIn: React.FC = () => {
    const { isAuthenticated, checkAuth } = useAuth();
    const { isProfileComplete } = useProfile();
    const [message, setMessage] = useState('');
    const [formValues, handleChange] = useForm({email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/apiServeur/signin', formValues);
            setMessage(response.data.message);
            if (response.data.message) {
                localStorage.setItem('token', response.data.token);
                checkAuth();
            }
        } catch (error) {
            setMessage(`UserSignin.tsx | Erreur frontend signin : ${error}`);
        }
    };

    useEffect(() => {
        if (isAuthenticated && isProfileComplete === false) {
            console.log("userSignin.tsx -> is authenticated and profile is UNcompleted please fill your profile");
            navigate('/apiServeur/userprofile');
        }
        else if (isAuthenticated && isProfileComplete) {
            console.log("userSignin.tsx -> profile is completed let's go to matcha");
            navigate('/apiServeur/mymatchaprofile');
        }
    })

    return (
        <section className="gradient-custom" >
        <div>
        <h1>🩵 Sign in ! 🩵</h1>
        </div>
        <div className="container py-5 h-100 ">
            <div className="row justify-content-center align-items-center h-100" >
            <div className="col-12 col-lg-9 col-xl-7">
                <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
                <div className="card-body p-4 p-md-5 ">
                    
                    <form onSubmit={handleSubmit}>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-outline-signin">
                            <div className="fields-signup">
                            <label className="form-label" htmlFor="emailAddress">Email</label>
                            </div>
                            <div className="highlight-text-signin">
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
                        <div data-mdb-input-init className="form-outline-signin">
                            <div className="fields-signup">
                            <label className="form-label" htmlFor="passwordAddress">Password</label>
                            </div>
                            <div className="highlight-text-signin">
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
                            className="btn btn-info btn-lg" 
                            style={{ color: 'violet', fontFamily: 'trukin'}}
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