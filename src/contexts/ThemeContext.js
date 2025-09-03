import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('auto');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'auto') {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription?.remove();
  }, [theme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('defocus2focus_theme');
      if (savedTheme) {
        setTheme(savedTheme);
        updateTheme(savedTheme);
      } else {
        // Default to system theme
        const systemTheme = Appearance.getColorScheme();
        setIsDark(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    
    switch (newTheme) {
      case 'light':
        setIsDark(false);
        break;
      case 'dark':
        setIsDark(true);
        break;
      case 'auto':
        const systemTheme = Appearance.getColorScheme();
        setIsDark(systemTheme === 'dark');
        break;
      default:
        setIsDark(false);
    }
  };

  const toggleTheme = async () => {
    try {
      let newTheme;
      switch (theme) {
        case 'light':
          newTheme = 'dark';
          break;
        case 'dark':
          newTheme = 'auto';
          break;
        case 'auto':
          newTheme = 'light';
          break;
        default:
          newTheme = 'light';
      }
      
      await AsyncStorage.setItem('defocus2focus_theme', newTheme);
      updateTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setThemeMode = async (newTheme) => {
    try {
      await AsyncStorage.setItem('defocus2focus_theme', newTheme);
      updateTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const value = {
    theme,
    isDark,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
