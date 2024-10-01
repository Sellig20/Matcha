import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';

const UserSettings: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/apiServeur/checktok`);
                setData(response.data);
            } catch (error) {
                console.error('userSettings.tsx | Error fetching home data', error);
            }
        };

        fetchData();
    }, []);

    return (
            <section className="gradient-custom" >
                <div>
            <h1>Welcome to your settings. Is it ok</h1>

            {/* {data ? <div>User: {JSON.stringify(data)}</div> : <div>Loading...</div>} */}

        </div>
            <div className="container py-5 h-100 ">
            <div className="row justify-content-center align-items-center h-100" >
            <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
            <div className="card-body p-4 p-md-5 ">
            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">Settings</h3>
    
            <div>
                <div className="row">
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <label>First name</label>
                    {/* <p>{profile.profile?.user_name}</p> */}
                </div>
                </div>
    
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <label>Last name</label>
                    {/* <p>{profile.profile?.gender}</p> */}
                </div>
                </div>
                </div>
    
                <div className="row">
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <label>Email</label>
                    {/* <p>{profile.profile?.age}</p> */}
                </div>
                </div>
    
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <label>Password</label>
                    {/* <p>{profile.profile?.sexualinterest}</p> */}
                </div>
                </div>
                </div>
    
                <div className="row">
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <label>Verified profile</label>
                    {/* <p>{profile.profile?.biography}</p> */}
                </div>
                </div>
    
                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline">
                    <label>GPS localisation athorised</label>
                    {/* <p>{profile.profile?.tags}</p> */}
                </div>
                </div>
                </div>
    
                <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                    <input data-mdb-ripple-init 
                        className="btn btn-primary btn-lg" 
                        type="modify" 
                        value="Modify" />
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
