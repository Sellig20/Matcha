import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import { useForm } from './useForm';
import { useAuth } from '../../security/useAuth';
import { genderEnum, sexualInterestEnum, tagsEnum, UserProfileInterface } from './UserInterface';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './profileContext';

const UserProfileDisplay: React.FC = () => {

    const { profile } = useProfile();

    return (
        <section className="gradient-custom" >
        <div className="container py-5 h-100 ">
        <div className="row justify-content-center align-items-center h-100" >
        <div className="col-12 col-lg-9 col-xl-7">
        <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
        <div className="card-body p-4 p-md-5 ">
        <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">My Profile</h3>

        <div>
            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Username</label>
                <p>{profile?.username}</p>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Gender</label>
                <p>{profile?.gender}</p>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>age</label>
                <p>{profile?.age}</p>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Sexual Interest</label>
                <p>{profile?.sexualinterest}</p>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Biography</label>
                <p>{profile?.biography}</p>
            </div>
            </div>

            <div className="col-md-6 mb-4 pb-2">
            <div data-mdb-input-init className="form-outline">
                <label>Tags</label>
                <p>{profile?.tags}</p>
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
    )
}

export default UserProfileDisplay;