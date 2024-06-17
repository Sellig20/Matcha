import { useContext } from 'react';
import { AuthContext } from './authContext';
import { AuthContextType } from './authContext';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth.tsx | must be used within an AuthProvider');
    }
    return context;
};

