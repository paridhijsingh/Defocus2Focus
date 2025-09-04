import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Platform } from 'react-native';

// Handle AsyncStorage for web compatibility
let AsyncStorage;
if (Platform.OS === 'web') {
  AsyncStorage = {
    getItem: async (key) => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting item in localStorage:', error);
      }
    },
    removeItem: async (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing item from localStorage:', error);
      }
    }
  };
} else {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

const AppContext = createContext();

// Initial state
const initialState = {
  // User data
  user: {
    username: '',
    email: '',
    isLoggedIn: false,
    hasCompletedOnboarding: false,
    avatar: '👤',
    level: 1,
    loginMethod: 'username', // 'username', 'google', 'email'
  },
  
  // App state
  currentScreen: 'welcome',
  isDefocusLocked: false,
  defocusTimer: null,
  theme: 'auto', // 'light', 'dark', 'auto'
  
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
    level: 1,
    badges: [],
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
      totalScore: 0,
    },
    tapGame: {
      highScore: 0,
      gamesPlayed: 0,
      totalScore: 0,
    },
  },
  
  // Leaderboard (local for now)
  leaderboard: [],
  
  // Settings
  settings: {
    theme: 'auto',
    defocusDuration: 10,
    notifications: true,
    reminderTime: '09:00',
    soundEnabled: true,
    hapticEnabled: true,
  },
  
  // AI Therapist data
  aiTherapist: {
    conversations: [],
    currentMood: 'neutral',
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
  ADD_AI_CONVERSATION: 'ADD_AI_CONVERSATION',
  UPDATE_LEADERBOARD: 'UPDATE_LEADERBOARD',
  ADD_BADGE: 'ADD_BADGE',
  SET_THEME: 'SET_THEME',
};

// Badge definitions
const BADGES = {
  FIRST_SESSION: { id: 'first_session', name: 'First Steps', description: 'Complete your first defocus session', icon: '🎯' },
  WEEK_STREAK: { id: 'week_streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥' },
  MONTH_STREAK: { id: 'month_streak', name: 'Month Master', description: 'Maintain a 30-day streak', icon: '👑' },
  HUNDRED_SESSIONS: { id: 'hundred_sessions', name: 'Century Club', description: 'Complete 100 defocus sessions', icon: '💯' },
  JOURNAL_WRITER: { id: 'journal_writer', name: 'Reflective Soul', description: 'Write 50 journal entries', icon: '📝' },
  GAME_MASTER: { id: 'game_master', name: 'Game Master', description: 'Play 100 games', icon: '🎮' },
  XP_COLLECTOR: { id: 'xp_collector', name: 'XP Collector', description: 'Earn 1000 XP', icon: '⭐' },
  COIN_HOARDER: { id: 'coin_hoarder', name: 'Coin Hoarder', description: 'Collect 500 coins', icon: '🪙' },
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
          email: action.payload.email || '',
          loginMethod: action.payload.loginMethod || 'username',
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
      
    case ActionTypes.ADD_AI_CONVERSATION:
      return {
        ...state,
        aiTherapist: {
          ...state.aiTherapist,
          conversations: [...state.aiTherapist.conversations, action.payload],
        },
      };
      
    case ActionTypes.UPDATE_LEADERBOARD:
      return {
        ...state,
        leaderboard: action.payload,
      };
      
    case ActionTypes.ADD_BADGE:
      const newBadges = [...state.stats.badges];
      if (!newBadges.find(badge => badge.id === action.payload.id)) {
        newBadges.push(action.payload);
      }
      return {
        ...state,
        stats: {
          ...state.stats,
          badges: newBadges,
        },
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        settings: {
          ...state.settings,
          theme: action.payload,
        },
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

  // Helper function to check and award badges
  const checkBadges = (newStats) => {
    const badges = [];
    
    // First session badge
    if (newStats.totalSessions === 1) {
      badges.push(BADGES.FIRST_SESSION);
    }
    
    // Streak badges
    if (newStats.streak === 7) {
      badges.push(BADGES.WEEK_STREAK);
    }
    if (newStats.streak === 30) {
      badges.push(BADGES.MONTH_STREAK);
    }
    
    // Session count badges
    if (newStats.totalSessions === 100) {
      badges.push(BADGES.HUNDRED_SESSIONS);
    }
    
    // Journal badges
    if (newStats.journalEntries === 50) {
      badges.push(BADGES.JOURNAL_WRITER);
    }
    
    // XP badges
    if (newStats.xp >= 1000) {
      badges.push(BADGES.XP_COLLECTOR);
    }
    
    // Coin badges
    if (newStats.coins >= 500) {
      badges.push(BADGES.COIN_HOARDER);
    }
    
    // Award new badges
    badges.forEach(badge => {
      if (!state.stats.badges.find(b => b.id === badge.id)) {
        dispatch({ type: ActionTypes.ADD_BADGE, payload: badge });
      }
    });
  };

  // Action creators
  const actions = {
    setUser: (userData) => dispatch({ type: ActionTypes.SET_USER, payload: userData }),
    
    login: (username, email = '', loginMethod = 'username') => dispatch({ 
      type: ActionTypes.LOGIN, 
      payload: { username, email, loginMethod } 
    }),
    
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
    
    completeOnboarding: () => dispatch({ type: ActionTypes.COMPLETE_ONBOARDING }),
    
    setCurrentScreen: (screen) => dispatch({ type: ActionTypes.SET_CURRENT_SCREEN, payload: screen }),
    
    setDefocusLock: (isLocked) => dispatch({ type: ActionTypes.SET_DEFOCUS_LOCK, payload: isLocked }),
    
    updateStats: (stats) => {
      const newStats = { ...state.stats, ...stats };
      dispatch({ type: ActionTypes.UPDATE_STATS, payload: newStats });
      checkBadges(newStats);
    },
    
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
    
    addAIConversation: (conversation) => dispatch({ 
      type: ActionTypes.ADD_AI_CONVERSATION, 
      payload: conversation 
    }),
    
    updateLeaderboard: (leaderboard) => dispatch({ 
      type: ActionTypes.UPDATE_LEADERBOARD, 
      payload: leaderboard 
    }),
    
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    
    // Helper functions
    completeDefocusSession: (duration) => {
      const xpEarned = Math.floor(duration / 5) * 10; // 10 XP per 5 minutes
      const coinsEarned = Math.floor(duration / 10) * 5; // 5 coins per 10 minutes
      
      const newStats = {
        totalSessions: state.stats.totalSessions + 1,
        totalHours: state.stats.totalHours + (duration / 60),
        todaySessions: state.stats.todaySessions + 1,
        xp: state.stats.xp + xpEarned,
        coins: state.stats.coins + coinsEarned,
        streak: state.stats.streak + 1,
      };
      
      dispatch({ type: ActionTypes.UPDATE_STATS, payload: newStats });
      checkBadges(newStats);
      
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
            totalScore: (state.games[gameType]?.totalScore || 0) + score,
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
    
    // AI Therapist responses
    getAIResponse: (message) => {
      const responses = {
        stress: [
          "It sounds like you're feeling overwhelmed. Try taking a few deep breaths and focusing on one thing at a time.",
          "Stress is a natural response. Remember to be kind to yourself and take breaks when needed.",
          "Consider what's within your control right now. Sometimes focusing on small steps can help reduce anxiety."
        ],
        focus: [
          "Great job on completing your defocus session! You're building a healthy habit.",
          "Consistency is key. Even short defocus sessions can make a big difference.",
          "Your mind is like a muscle - the more you practice defocusing, the stronger your focus becomes."
        ],
        motivation: [
          "You're doing amazing! Every defocus session is a step toward better mental health.",
          "Remember why you started this journey. You're investing in your well-being.",
          "Progress isn't always linear. Celebrate the small wins along the way."
        ],
        default: [
          "Thank you for sharing. How are you feeling after your defocus session?",
          "That's interesting. Can you tell me more about what's on your mind?",
          "I'm here to listen. What would you like to explore today?"
        ]
      };
      
      const messageLower = message.toLowerCase();
      let category = 'default';
      
      if (messageLower.includes('stress') || messageLower.includes('overwhelmed') || messageLower.includes('anxious')) {
        category = 'stress';
      } else if (messageLower.includes('focus') || messageLower.includes('concentrate') || messageLower.includes('session')) {
        category = 'focus';
      } else if (messageLower.includes('motivation') || messageLower.includes('motivated') || messageLower.includes('progress')) {
        category = 'motivation';
      }
      
      const categoryResponses = responses[category];
      const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
      
      const conversation = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userMessage: message,
        aiResponse: randomResponse,
        category,
      };
      
      dispatch({ type: ActionTypes.ADD_AI_CONVERSATION, payload: conversation });
      return randomResponse;
    },
  };

  const value = {
    state,
    actions,
    BADGES,
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
