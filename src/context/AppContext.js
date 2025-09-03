import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

// Initial state
const initialState = {
  // User data
  user: {
    username: '',
    isLoggedIn: false,
    hasCompletedOnboarding: false,
  },
  
  // App state
  currentScreen: 'onboarding',
  isDefocusLocked: false,
  defocusTimer: null,
  
  // Stats
  stats: {
    streak: 0,
    totalSessions: 0,
    totalHours: 0,
    journalEntries: 0,
    xp: 0,
    coins: 0,
    todaySessions: 0,
    todayGoal: 5,
  },
  
  // History
  history: [],
  
  // Journal entries
  journalEntries: [],
  
  // Games data
  games: {
    memoryMatch: {
      highScore: 0,
      gamesPlayed: 0,
    },
    tapGame: {
      highScore: 0,
      gamesPlayed: 0,
    },
  },
  
  // Settings
  settings: {
    theme: 'auto', // 'light', 'dark', 'auto'
    defocusDuration: 10, // minutes
    notifications: true,
  },
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',
  SET_CURRENT_SCREEN: 'SET_CURRENT_SCREEN',
  SET_DEFOCUS_LOCK: 'SET_DEFOCUS_LOCK',
  UPDATE_STATS: 'UPDATE_STATS',
  ADD_HISTORY_ENTRY: 'ADD_HISTORY_ENTRY',
  ADD_JOURNAL_ENTRY: 'ADD_JOURNAL_ENTRY',
  UPDATE_GAME_STATS: 'UPDATE_GAME_STATS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  LOAD_DATA: 'LOAD_DATA',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
      
    case ActionTypes.LOGIN:
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload.username,
          isLoggedIn: true,
        },
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: {
          ...state.user,
          username: '',
          isLoggedIn: false,
        },
      };
      
    case ActionTypes.COMPLETE_ONBOARDING:
      return {
        ...state,
        user: {
          ...state.user,
          hasCompletedOnboarding: true,
        },
      };
      
    case ActionTypes.SET_CURRENT_SCREEN:
      return {
        ...state,
        currentScreen: action.payload,
      };
      
    case ActionTypes.SET_DEFOCUS_LOCK:
      return {
        ...state,
        isDefocusLocked: action.payload,
      };
      
    case ActionTypes.UPDATE_STATS:
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
      };
      
    case ActionTypes.ADD_HISTORY_ENTRY:
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
      
    case ActionTypes.ADD_JOURNAL_ENTRY:
      return {
        ...state,
        journalEntries: [action.payload, ...state.journalEntries],
        stats: {
          ...state.stats,
          journalEntries: state.journalEntries.length + 1,
        },
      };
      
    case ActionTypes.UPDATE_GAME_STATS:
      return {
        ...state,
        games: {
          ...state.games,
          [action.payload.game]: {
            ...state.games[action.payload.game],
            ...action.payload.stats,
          },
        },
      };
      
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      
    case ActionTypes.LOAD_DATA:
      return {
        ...state,
        ...action.payload,
      };
      
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from storage on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  // Save data to storage whenever state changes
  useEffect(() => {
    saveDataToStorage();
  }, [state]);

  const loadStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('defocus2focus_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        dispatch({ type: ActionTypes.LOAD_DATA, payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      await AsyncStorage.setItem('defocus2focus_data', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Action creators
  const actions = {
    setUser: (userData) => dispatch({ type: ActionTypes.SET_USER, payload: userData }),
    
    login: (username) => dispatch({ type: ActionTypes.LOGIN, payload: { username } }),
    
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
    
    completeOnboarding: () => dispatch({ type: ActionTypes.COMPLETE_ONBOARDING }),
    
    setCurrentScreen: (screen) => dispatch({ type: ActionTypes.SET_CURRENT_SCREEN, payload: screen }),
    
    setDefocusLock: (isLocked) => dispatch({ type: ActionTypes.SET_DEFOCUS_LOCK, payload: isLocked }),
    
    updateStats: (stats) => dispatch({ type: ActionTypes.UPDATE_STATS, payload: stats }),
    
    addHistoryEntry: (entry) => {
      const historyEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...entry,
      };
      dispatch({ type: ActionTypes.ADD_HISTORY_ENTRY, payload: historyEntry });
    },
    
    addJournalEntry: (entry) => {
      const journalEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...entry,
      };
      dispatch({ type: ActionTypes.ADD_JOURNAL_ENTRY, payload: journalEntry });
    },
    
    updateGameStats: (game, stats) => dispatch({ 
      type: ActionTypes.UPDATE_GAME_STATS, 
      payload: { game, stats } 
    }),
    
    updateSettings: (settings) => dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings }),
    
    // Helper functions
    completeDefocusSession: (duration) => {
      const xpEarned = Math.floor(duration / 5) * 10; // 10 XP per 5 minutes
      const coinsEarned = Math.floor(duration / 10) * 5; // 5 coins per 10 minutes
      
      dispatch({ type: ActionTypes.UPDATE_STATS, payload: {
        totalSessions: state.stats.totalSessions + 1,
        totalHours: state.stats.totalHours + (duration / 60),
        todaySessions: state.stats.todaySessions + 1,
        xp: state.stats.xp + xpEarned,
        coins: state.stats.coins + coinsEarned,
        streak: state.stats.streak + 1,
      }});
      
      const historyEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'defocus',
        duration,
        xpEarned,
        coinsEarned,
      };
      dispatch({ type: ActionTypes.ADD_HISTORY_ENTRY, payload: historyEntry });
    },
    
    completeGame: (gameType, score) => {
      const xpEarned = Math.floor(score / 100) * 5; // 5 XP per 100 points
      const coinsEarned = Math.floor(score / 200) * 2; // 2 coins per 200 points
      
      dispatch({ type: ActionTypes.UPDATE_STATS, payload: {
        xp: state.stats.xp + xpEarned,
        coins: state.stats.coins + coinsEarned,
      }});
      
      dispatch({ 
        type: ActionTypes.UPDATE_GAME_STATS, 
        payload: { 
          game: gameType, 
          stats: {
            highScore: Math.max(state.games[gameType]?.highScore || 0, score),
            gamesPlayed: (state.games[gameType]?.gamesPlayed || 0) + 1,
          }
        } 
      });
      
      const historyEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'game',
        gameType,
        score,
        xpEarned,
        coinsEarned,
      };
      dispatch({ type: ActionTypes.ADD_HISTORY_ENTRY, payload: historyEntry });
    },
  };

  const value = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
