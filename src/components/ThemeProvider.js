import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => null,
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const theme = 'light';
  const setTheme = () => {
    // Theme is locked to light.
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add('light');
    try {
      localStorage.setItem('theme', 'light');
    } catch (e) {
      // ignore storage failures
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
