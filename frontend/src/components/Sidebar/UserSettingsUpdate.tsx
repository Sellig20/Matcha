import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Sidebar/UserSettings.css"
import { useNavigate } from 'react-router-dom';
import { useForm } from '../Navbar/User/useForm';
import { useProfile } from '../Navbar/User/profileContext';

const UserSettingsUpdate: React.FC = () => {

    const [dataValidity, setValidity] = useState<any>(null);
    const [data, setData] = useState<any>(null); //remplacer les any par une interface ? UserCreate ? a voir
    const { profile , fetchProfile } = useProfile();
    const [formValues, handleChange] = useForm({ usersettingsid: '', first_name: profile?.first_name || '', last_name: profile?.last_name || '', email: profile?.email || '', pass_word: profile?.pass_word || ''});
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`http://localhost:8000/apiServeur/usersettings`, formValues);
            setMessage(response.data.message);
            if (response.data) {
                await fetchProfile();
                navigate('/apiServeur/usersettings');
            }
        } catch (error) {
            setMessage(`UserSettingsUpdate.tsx | Erreur frontend usersettingsUPDATE : ${error}`);
        }
    };
    
    const handleModifyClick = () => {
        
    }

    return (
        <section className="gradient-custom" >
        <div>
        <h1>🩵 Modify your user account settings 🩵</h1>
        </div>
            <div className="container py-5 h-100 ">
            <div className="row justify-content-center align-items-center h-100" >
            <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
            <div className="card-body p-4 p-md-5 ">
            {/* <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">Settings</h3> */}
    
            <div className="bigBox">

            <form onSubmit={handleSubmit}>

                <div className="us row">
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <div className="fields">
                    <label>First name</label>
                    </div>
                    <input 
                    type="text" 
                    id="first_name"
                    className="form-control form-control-lg" 
                    value={formValues.first_name}
                    onChange={handleChange}
                    required
                    />
                    
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
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </section>
    );
};

export default UserSettingsUpdate;