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
            console.log("is authent oui je vais navigate a userprofile");
            navigate('/apiServeur/userprofile');
        }
        else if (isAuthenticated && isProfileComplete) {
            console.log("Profile a deja ete complete, tu sign in, on va te faire matcher bb");
            navigate('/apiServeur/mymatchaprofile');
        }
    })

    return (
        <section className="gradient-custom" >
        <div className="container py-5 h-100 ">
            <div className="row justify-content-center align-items-center h-100" >
            <div className="col-12 col-lg-9 col-xl-7">
                <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
                <div className="card-body p-4 p-md-5 ">
                    
                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">Sign in !</h3>
                    
                    <form onSubmit={handleSubmit}>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="emailAddress">Email</label>
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

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="passwordAddress">Password</label>
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

                    <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                        <input data-mdb-ripple-init 
                            className="btn btn-info btn-lg" 
                            type="submit" 
                            value="Submit" />
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