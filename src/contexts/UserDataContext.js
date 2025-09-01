import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: {
    name: 'Focus Master',
    level: 1,
    experience: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
  },
  sessions: [],
  stats: {
    totalFocusTime: 0,
    totalSessions: 0,
    averageSessionLength: 0,
    weeklyGoal: 1200, // 20 hours in minutes
    weeklyProgress: 0,
  },
  settings: {
    focusDuration: 25, // minutes
    breakDuration: 5, // minutes
    longBreakDuration: 15, // minutes
    sessionsBeforeLongBreak: 4,
  }
};

// Action types
const ACTIONS = {
  ADD_SESSION: 'ADD_SESSION',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_STATS: 'UPDATE_STATS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA',
};

// Reducer function
function userDataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_SESSION:
      const newSession = action.payload;
      const updatedSessions = [...state.sessions, newSession];
      
      // Calculate new stats
      const totalFocusTime = updatedSessions.reduce((sum, session) => sum + session.duration, 0);
      const totalSessions = updatedSessions.length;
      const averageSessionLength = totalSessions > 0 ? totalFocusTime / totalSessions : 0;
      
      // Calculate weekly progress (simplified - just last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklySessions = updatedSessions.filter(session => 
        new Date(session.date) > oneWeekAgo
      );
      const weeklyProgress = weeklySessions.reduce((sum, session) => sum + session.duration, 0);
      
      // Update user experience and level
      const pointsEarned = Math.floor(newSession.duration / 5) + (newSession.completed ? 10 : 0);
      const newTotalPoints = state.user.totalPoints + pointsEarned;
      const newExperience = state.user.experience + pointsEarned;
      const newLevel = Math.floor(newExperience / 100) + 1;
      
      // Update streak
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      let newStreak = state.user.currentStreak;
      if (newSession.completed) {
        if (state.sessions.length === 0 || 
            new Date(state.sessions[state.sessions.length - 1].date).toDateString() === yesterdayStr) {
          newStreak += 1;
        } else if (new Date(state.sessions[state.sessions.length - 1].date).toDateString() !== today) {
          newStreak = 1;
        }
      }
      
      return {
        ...state,
        sessions: updatedSessions,
        user: {
          ...state.user,
          totalPoints: newTotalPoints,
          experience: newExperience,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, state.user.longestStreak),
        },
        stats: {
          ...state.stats,
          totalFocusTime,
          totalSessions,
          averageSessionLength,
          weeklyProgress,
        }
      };
      
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    case ACTIONS.UPDATE_STATS:
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };
      
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      
    case ACTIONS.LOAD_DATA:
      return { ...state, ...action.payload };
      
    default:
      return state;
  }
}

// Create context
const UserDataContext = createContext();

// Provider component
export function UserDataProvider({ children }) {
  const [state, dispatch] = useReducer(userDataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('defocus2focus_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('defocus2focus_data', JSON.stringify(state));
  }, [state]);

  // Action creators
  const addSession = (session) => {
    dispatch({ type: ACTIONS.ADD_SESSION, payload: session });
  };

  const updateUser = (userData) => {
    dispatch({ type: ACTIONS.UPDATE_USER, payload: userData });
  };

  const updateStats = (statsData) => {
    dispatch({ type: ACTIONS.UPDATE_STATS, payload: statsData });
  };

  const updateSettings = (settingsData) => {
    dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settingsData });
  };

  const value = {
    ...state,
    addSession,
    updateUser,
    updateStats,
    updateSettings,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

// Custom hook to use the context
export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
