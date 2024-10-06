import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Sidebar/UserSettings.css"

const UserSettings: React.FC = () => {
    const [dataValidity, setValidity] = useState<any>(null);
    const [data, setData] = useState<any>(null); //remplacer les any par une interface ? UserCreate ? a voir

    useEffect(() => {
        const fetchValidity = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/apiServeur/checktok`);
                setValidity(response.data);
            } catch (error) {
                console.error('userSettings.tsx | Error fetching validity chechAuth', error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/apiServeur/usersettings`);
                setData(response.data);
            } catch (error) {
                console.error('userSettings.tsx | Error fetching home data', error);
            }
        }
        fetchValidity();
        fetchData();
    }, []);

    return (
        <section className="gradient-custom" >
        <div>
        <h1>🩵 User account settings 🩵</h1>
        </div>
            <div className="container py-5 h-100 ">
            <div className="row justify-content-center align-items-center h-100" >
            <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
            <div className="card-body p-4 p-md-5 ">
            {/* <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">Settings</h3> */}
    
            <div className="bigBox">
                <div className="us row">
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <div className="fields">
                    <label>First name</label>
                    </div>
                    <div className="highlight-text">
                    <p>{data?.user?.first_name}</p>
                    </div>
                </div>
                </div>
    
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <div className="fields">
                    <label>Last name</label>
                    </div>
                    <div className="highlight-text">
                    <p>{data?.user?.last_name}</p>
                    </div>
                </div>
                </div>
                </div>
    
                <div className ="vertical">
                <div data-mdb-input-init className="form-outline">
                    <div className="fields">
                    <label>Email</label>
                    </div>
                    <div className="highlight-text">
                    <p>{data?.user?.email}</p>
                    </div>
                </div>
    
                <div data-mdb-input-init className="form-outline">
                    <div className="fields">
                    <label>Password</label>
                    </div>
                    <div className="highlight-text">
                    <p>get the password db </p>
                    {/* <p>{data?.user?.password}</p> */}
                    </div>
                </div>
    
                <div data-mdb-input-init className="form-outline">
                    <div className="fields">
                    <label>Verified profile ?</label>
                    </div>
                    <div className="highlight-text">
                    <p>oui / non </p>
                    </div>
                </div>
    
                <div data-mdb-input-init className="form-outline">
                    <div className="fields">
                    <label>GPS localisation authorised ?</label>
                    </div>
                    <div className="highlight-text">
                    <p> oui / non </p>
                    </div>
                </div>
                </div>
    
                <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                    <input data-mdb-ripple-init 
                        className="btn btn-info btn-lg" 
                        type="modify" 
                        value="Modify"
                        style={{ color: 'violet', fontFamily: 'trukin'}} />
                </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </section>
    );
};

export default UserSettings;
