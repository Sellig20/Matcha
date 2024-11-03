import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { createContext } from 'react';
import axiosInstance from './axiosInstance';

export interface AuthContextType {
    isAuthenticated: boolean | null;
    checkAuth: () => void;
    signedOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    
    const signedOut = async () => {
        try {
            console.log("\n\n\nUsersignup.tsx | signedout");
            setIsAuthenticated(null);
        } catch (err) {
            console.log("\n\n\nUseAuth.tsx | Error during sign out: ", err);    
        }
    }

    const checkAuth = async () => {
        try {
            const token = sessionStorage.getItem('token'); 
            if (!token) {
                    console.log("\n\n\nAuthContext.tsx | Error pas de token dans session storage");
                setIsAuthenticated(false);                    
                return;
            }
            const response = await axiosInstance.get('http://localhost:8000/apiServeur/checktok', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAuthenticated(response.data.valid);
            } catch (err) {
                console.log("authContext.tsx | Error during auth check: ", err);    
                setIsAuthenticated(false);
            }
        };

        useEffect(() => {
            if (isAuthenticated != null) {
                checkAuth();
            }
        })

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkAuth, signedOut }}>
            {children}
        </AuthContext.Provider>
    );
};