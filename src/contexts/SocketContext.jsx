import React, { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // クライアント側のみでimport
    let io;
    if (typeof window !== 'undefined') {
      import('socket.io-client').then((module) => {
        io = module.default;
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        // クリーンアップ
        return () => {
          newSocket.close();
        };
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}; 