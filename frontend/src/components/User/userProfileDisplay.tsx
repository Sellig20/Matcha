import React, { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import { useForm } from './useForm';
import axios from 'axios';
import { useAuth } from '../../security/useAuth';
import { genderEnum, sexualInterestEnum, tagsEnum } from './userInterface';
import { useNavigate } from 'react-router-dom';

const UserProfileDisplay: React.FC = () => {

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.post('http://localhost:8000/apiServeur/userprofile/display');
                console.log("\n\n\n\n\nUserProfile.tsx | TA OK \n\n\n\n\n");
                setMessage(res.data.message);
            } catch (error) {
                console.error('userprofile.tsx DISPLAY', error);
            }
        };
        
    })

    return (
        <div>
            user profile display
        </div>
    )
}

export default UserProfileDisplay;