import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { createContext } from 'react';

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
            console.log("\n\n\nUsersignup.tsx | signedout xxxxxx");
            setIsAuthenticated(null);
        } catch (err) {
            console.log("\n\n\nUseAuth.tsx | Error during sign out: ", err);    
        }
    }

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                    console.log("\n\n\nAuthContext.tsx | Error pas de token dans protected routes");
                setIsAuthenticated(false);                    
                return;
            }
            const response = await axios.get('http://localhost:8000/apiServeur/checktok', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAuthenticated(response.data.valid);
                console.log("\n\n\nAuthContext.tsx | Response from /apiServeur/checktok: ", response.data);
            } catch (err) {
                console.log("authContext.tsx | Error during auth check: ", err);    
                if (axios.isAxiosError(err)) {
                    console.error("\n\n\nAuthContext.tsx | Error response:", err.response?.data);
                }
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