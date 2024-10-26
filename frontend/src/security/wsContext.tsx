import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Créez une interface pour votre contexte
interface WebSocketContextProps {
    socket: Socket | null;
}

// Créez le contexte avec une valeur par défaut
const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

// Le provider du contexte
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {

        const newSocket = io('http://localhost:8000');

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
