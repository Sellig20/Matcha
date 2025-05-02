import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useProfile } from '../components/Navbar/User/profileContext';
import axiosInstance from './axiosInstance';

interface WebSocketContextProps {
    socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const [id, setId] = useState('');
    const [message, setMessage] = useState('');

    const fetchId = async () => {
        try {
            const response = await axiosInstance.get('http://localhost:8000/apiServeur/navbar');
            setId(response.data.userId);
        } catch (error) {
            setMessage(`Navbar.tsx | Erreur frontend navbar FETCH ID: ${error}`);
        }
    }

    useEffect(() => {
        
        fetchId();

        const newSocket = io('http://localhost:8000', {
            query: { userId: id}
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('WebSocket FRONTEND connected: ', newSocket.id);
        });

        newSocket.off('disconnect', () => {
            console.log('WebSocket FRONTEND DISconnected: ', newSocket.id);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte WebSocket
export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
