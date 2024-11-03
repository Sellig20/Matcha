import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../../../security/axiosInstance';
import { UserProfileInterface } from "./UserInterface";
import { useAuth } from '../../../security/useAuth';
import { useWebSocketContext } from '../../../security/wsContext';
import UserProfileDisplay from './UserProfileDisplay';

export interface ProfileContextType {
    profile: UserProfileInterface | null;
    isProfileComplete: boolean;
    warning: string | null;
    fetchProfile: () => Promise<boolean>;
}

export interface UserProfileResponse {
    message: string;
    displayProfile: UserProfileInterface;
    isProfileComplete: boolean;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfileInterface | null>(null);
    const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
    const [warning, setWarning] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const [message, setMessage] = useState('');
    const { socket } = useWebSocketContext();
    
    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/userprofile/display`);
            setIsProfileComplete(response.data.displayProfile[0].is_profile_completed);
            setProfile(response.data.displayProfile[0]);
            return response.data.displayProfile[0].is_profile_completed
        } catch (err) {
            console.error("profile context error :", err);
            return false;
        } 
    }

    const fetchIsProfileComplete = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/isprofilecomplete`);
            setIsProfileComplete(response.data.isProfileCompletedDB);
        } catch (error) {
            setMessage(`userprofile.tsx | Erreur app.tsx fetching isProfileComplete: ${error}`);
            return null;
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('is_profile_complete', (status) => {
                setIsProfileComplete(status === 'true');
            })
        }
        if (isAuthenticated === true) {
            fetchIsProfileComplete()
            fetchProfile();
        }
      }, [socket, isAuthenticated, isProfileComplete]);

    return (
        <ProfileContext.Provider value={{ isProfileComplete, profile, warning, fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('profileContext.tsx | useProfile must be used within a ProfileProvider');
    }
    return context;
};
