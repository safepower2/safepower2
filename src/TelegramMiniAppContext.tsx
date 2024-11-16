import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const TelegramMiniAppContext = createContext(null);

// Create a provider component
export const TelegramMiniAppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Assuming Telegram Web Apps SDK is available globally as window.Telegram
    const initData = (window as any).Telegram.WebApp.initDataUnsafe;
    setUserData(initData.user);
  }, []);

  return <TelegramMiniAppContext.Provider value={userData}>{children}</TelegramMiniAppContext.Provider>;
};

// Custom hook to use the TelegramMiniAppContext
export const useTelegramMiniApp = () => {
  return useContext(TelegramMiniAppContext) as unknown as { username: string; first_name: string; last_name: string };
};
