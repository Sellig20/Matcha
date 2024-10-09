import React, { useEffect, useState } from 'react';
import { useProfile } from './profileContext';
import "../../../assets/styles/Navbar/User/UserProfileDisplay.css"
import { useNavigate } from 'react-router-dom';

const UserProfileDisplay: React.FC = () => {

    const profile = useProfile();
    const navigate = useNavigate();

    const handleModifyClick = () => {
        navigate('/apiServeur/userprofile/display/update');
    }

    return (
        <section className="gradient-custom" >
        <div>
        <h1>🩵 User profile settings 🩵</h1>
        </div>
        <div className="container py-5 h-100 ">
        <div className="row justify-content-center align-items-center h-100" >
        <div className="col-12 col-lg-9 col-xl-7">
        <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
        <div className="card-body p-4 p-md-5 ">
        {/* <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">My Profile</h3> */}

        <div className="bigBox-profile-display">
            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields-profile-display">
                <label>Username</label>
                </div>
                <div className="highlight-text">
                <p>{profile.profile?.user_name}</p>
                </div>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields-profile-display">
                <label>Gender</label>
                </div>
                <div className="highlight-text">
                <p>{profile.profile?.gender}</p>
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
                <p>{profile.profile?.age}</p>
                </div>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline-profile-display">
                <div className="fields-profile-display">
                <label>Sexual Interest</label>
                </div>
                <div className="highlight-text">
                <p>{profile.profile?.sexualinterest}</p>
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
                    <p>{profile.profile?.biography}</p>
                    </div>
                </div>
                </div>

                <div className="col-md-6 mb-4 pb-2">
                <div data-mdb-input-init className="form-outline-profile-display">
                    <div className="fields-profile-display">
                    <label>Tags</label>
                    </div>
                    <div className="highlight-text">
                    <p>{profile.profile?.tags}</p>
                    </div>
                </div>
                </div>
            </div>

            <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                    <button data-mdb-ripple-init 
                        className="btn btn-info btn-lg" 
                        style={{ color: 'violet', fontFamily: 'trukin'}}
                        onClick={handleModifyClick}
                    > Modify </button>
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

export default UserProfileDisplay;