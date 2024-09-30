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
            const res = await axiosInstance.get(`http://localhost:8000/apiServeur/userprofile/display`);
            // const pro = res.data.displayProfile[0];
            setProfile(res.data.displayProfile[0]);
            setIsProfileComplete(res.data.isProfileComplete);
            const gogo = res.data.displayProfile[0].user_name;
            console.log("\n\n\n\n\n GOGO ISSSSSSSSSSSSSSSSSSSS ====> ", gogo);
            console.log("\n\nprofile context : setProfile => ", res);
            console.log("\nprofile context : isProfileComplete => ", res.data.isProfileComplete, "\n\n");
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
