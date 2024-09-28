import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../../security/axiosInstance';
import { UserProfileInterface } from "./UserInterface";
import { useAuth } from '../../security/useAuth';

export interface ProfileContextType {
    profile: UserProfileInterface | null;
    isProfileComplete: boolean | false;
    fetchProfile: () => void;
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
    const { isAuthenticated } = useAuth();
    
    const fetchProfile = async () => {
        try {
            console.log("\n\nres------data-------displayProfile------- ");
            const res = await axiosInstance.get<UserProfileResponse>(`http://localhost:8000/apiServeur/userprofile/display`);
            setProfile(res.data.displayProfile);
            setIsProfileComplete(res.data.isProfileComplete);
            console.log("\n\nprofile context : setProfile => ", res.data.displayProfile);
            console.log("\nprofile context : isProfileComplete => ", res.data.isProfileComplete, "\n\n");
            // else {
            //     setIsProfileComplete(false);
            // } 

        } catch (err) {
            
                console.error("Unknown error:", err);
            
        } 
    }

    useEffect(() => {
        console.log("profile complete in useeffect de profile.Context.tsx ? ", isProfileComplete);
        if (isAuthenticated === true && isProfileComplete === true) {
            fetchProfile();
        }
      }, [isAuthenticated, isProfileComplete]);

    return (
        <ProfileContext.Provider value={{ isProfileComplete, profile, fetchProfile }}>
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
