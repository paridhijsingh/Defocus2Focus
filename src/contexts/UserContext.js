import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Paridhi',
    email: '',
    avatar: null,
    preferences: {
      notifications: true,
      soundEnabled: true,
      hapticFeedback: true,
    },
  });

  const [stats, setStats] = useState({
    totalFocusSessions: 0,
    totalDefocusSessions: 0,
    totalHoursFocused: 0,
    journalEntries: 0,
    currentStreak: 0,
    xp: 0,
    coins: 0,
    level: 1,
  });

  const [dailyProgress, setDailyProgress] = useState({
    focusSessionsCompleted: 0,
    focusSessionsGoal: 5,
    defocusSessionsCompleted: 0,
    defocusSessionsGoal: 3,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('defocus2focus_user');
      const savedStats = await AsyncStorage.getItem('defocus2focus_stats');
      const savedProgress = await AsyncStorage.getItem('defocus2focus_daily_progress');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      if (savedProgress) {
        setDailyProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem('defocus2focus_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const updateStats = async (newStats) => {
    try {
      const updatedStats = { ...stats, ...newStats };
      setStats(updatedStats);
      await AsyncStorage.setItem('defocus2focus_stats', JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const updateDailyProgress = async (progress) => {
    try {
      const updatedProgress = { ...dailyProgress, ...progress };
      setDailyProgress(updatedProgress);
      await AsyncStorage.setItem('defocus2focus_daily_progress', JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error updating daily progress:', error);
    }
  };

  const addFocusSession = async () => {
    const newStats = {
      ...stats,
      totalFocusSessions: stats.totalFocusSessions + 1,
      totalHoursFocused: stats.totalHoursFocused + 0.5, // Assuming 30min sessions
      xp: stats.xp + 50,
      coins: stats.coins + 10,
    };
    await updateStats(newStats);

    const newProgress = {
      ...dailyProgress,
      focusSessionsCompleted: dailyProgress.focusSessionsCompleted + 1,
    };
    await updateDailyProgress(newProgress);
  };

  const addDefocusSession = async () => {
    const newStats = {
      ...stats,
      totalDefocusSessions: stats.totalDefocusSessions + 1,
      xp: stats.xp + 25,
      coins: stats.coins + 5,
    };
    await updateStats(newStats);

    const newProgress = {
      ...dailyProgress,
      defocusSessionsCompleted: dailyProgress.defocusSessionsCompleted + 1,
    };
    await updateDailyProgress(newProgress);
  };

  const addJournalEntry = async () => {
    const newStats = {
      ...stats,
      journalEntries: stats.journalEntries + 1,
      xp: stats.xp + 15,
      coins: stats.coins + 3,
    };
    await updateStats(newStats);
  };

  const resetDailyProgress = async () => {
    const resetProgress = {
      focusSessionsCompleted: 0,
      focusSessionsGoal: 5,
      defocusSessionsCompleted: 0,
      defocusSessionsGoal: 3,
    };
    await updateDailyProgress(resetProgress);
  };

  const value = {
    user,
    stats,
    dailyProgress,
    updateUser,
    updateStats,
    updateDailyProgress,
    addFocusSession,
    addDefocusSession,
    addJournalEntry,
    resetDailyProgress,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
