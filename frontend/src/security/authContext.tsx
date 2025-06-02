import React, { useContext, useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { createContext } from "react";
import axiosInstance from "./axiosInstance";

export interface AuthContextType {
  isAuthenticated: boolean | null;
  checkAuthentification: () => void;
  signedOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const signedOut = async () => {
    try {
      console.log("\n\n\nUsersignup.tsx | signedout");
      setIsAuthenticated(null);
      sessionStorage.removeItem("token");
    } catch (err) {
      console.log("\n\n\nUseAuth.tsx | Error during sign out: ", err);
    }
  };

  const checkAuthentification = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.log(
          "\n\n\nAuthContext.tsx | Error no token was provided from browser"
        );
        setIsAuthenticated(false);
        return;
      }
      const response = await axiosInstance.get(
        "http://localhost:8000/apiServeur/checktoken",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsAuthenticated(response.data.valid);
    } catch (err) {
      console.log("\n\n\nAuthContext.tsx | Error during auth check: ", err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated != null) {
      checkAuthentification();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, checkAuthentification, signedOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
