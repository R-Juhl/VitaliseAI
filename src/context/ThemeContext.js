// src/context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import useAppSettings from '../store/useAppSettings';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { displaySetting } = useAppSettings();
  const [theme, setTheme] = useState(displaySetting); // 'dark' or 'light'

  useEffect(() => {
    setTheme(displaySetting);
  }, [displaySetting]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
