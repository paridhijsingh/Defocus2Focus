import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FocusContext = createContext();

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

export const FocusProvider = ({ children }) => {
  // Core session state
  const [sessionState, setSessionState] = useState({
    isFocusActive: false,        // True when focus session is running
    isDefocusUsed: false,        // True when defocus has been used (locks defocus)
    isDefocusLocked: false,      // True when defocus is locked (computed state)
    currentFocusSession: null,   // Current focus session data
    completedCyclesToday: 0,     // Number of completed focus cycles today
    lastCycleDate: null,         // Date of last completed cycle
  });

  // Quick reset state (always available)
  const [quickResetState, setQuickResetState] = useState({
    isActive: false,
    duration: 60, // 1 minute in seconds
    remainingTime: 0,
  });

  // Load session state from AsyncStorage on app start
  useEffect(() => {
    loadSessionState();
  }, []);

  // Save session state to AsyncStorage whenever it changes
  useEffect(() => {
    saveSessionState();
  }, [sessionState]);

  // Compute defocus lock status
  useEffect(() => {
    const isLocked = sessionState.isDefocusUsed || sessionState.isFocusActive;
    setSessionState(prev => ({
      ...prev,
      isDefocusLocked: isLocked
    }));
  }, [sessionState.isDefocusUsed, sessionState.isFocusActive]);

  /**
   * Load session state from AsyncStorage
   */
  const loadSessionState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('focusSessionState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Check if we need to reset daily counters
        const today = new Date().toDateString();
        if (parsedState.lastCycleDate !== today) {
          // Reset daily counters for new day
          setSessionState(prev => ({
            ...prev,
            completedCyclesToday: 0,
            lastCycleDate: today,
            isDefocusUsed: false, // Reset defocus usage for new day
            isFocusActive: false, // Reset focus state for new day
          }));
        } else {
          setSessionState(prev => ({ ...prev, ...parsedState }));
        }
        
        console.log('📱 Loaded focus session state:', parsedState);
      }
    } catch (error) {
      console.error('Error loading focus session state:', error);
    }
  };

  /**
   * Save session state to AsyncStorage
   */
  const saveSessionState = async () => {
    try {
      await AsyncStorage.setItem('focusSessionState', JSON.stringify(sessionState));
      console.log('💾 Saved focus session state:', sessionState);
    } catch (error) {
      console.error('Error saving focus session state:', error);
    }
  };

  /**
   * Start a defocus session
   * This locks defocus until a focus session is completed
   */
  const startDefocus = (defocusType, duration = 10) => {
    if (sessionState.isDefocusLocked) {
      console.log('🔒 Defocus is locked, cannot start defocus session');
      return false;
    }

    console.log('🌿 Starting defocus session:', defocusType, duration);
    
    setSessionState(prev => ({
      ...prev,
      isDefocusUsed: true, // Lock defocus after use
    }));

    return true;
  };

  /**
   * End a defocus session
   * Defocus remains locked until focus session is completed
   */
  const endDefocus = () => {
    console.log('🌿 Defocus session ended');
    // Defocus remains locked until focus session is completed
  };

  /**
   * Start a focus session
   * This keeps defocus locked during the session
   */
  const startFocus = (focusData = {}) => {
    console.log('🎯 Starting focus session');
    
    const focusSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      duration: focusData.duration || 25, // Default 25 minutes
      type: focusData.type || 'pomodoro',
      ...focusData
    };

    setSessionState(prev => ({
      ...prev,
      isFocusActive: true,
      currentFocusSession: focusSession,
    }));

    return focusSession;
  };

  /**
   * End a focus session
   * This unlocks defocus and completes the cycle
   */
  const endFocus = (sessionData = {}) => {
    console.log('🎯 Ending focus session');
    
    const today = new Date().toDateString();
    const wasDefocusUsed = sessionState.isDefocusUsed;
    
    setSessionState(prev => ({
      ...prev,
      isFocusActive: false,
      isDefocusUsed: false, // Unlock defocus
      currentFocusSession: null,
      completedCyclesToday: prev.lastCycleDate === today 
        ? prev.completedCyclesToday + (wasDefocusUsed ? 1 : 0) // Only count if defocus was used
        : 1, // First cycle of the day
      lastCycleDate: today,
    }));

    // Return completion data
    return {
      cycleCompleted: wasDefocusUsed,
      totalCyclesToday: sessionState.lastCycleDate === today 
        ? sessionState.completedCyclesToday + (wasDefocusUsed ? 1 : 0)
        : 1,
    };
  };

  /**
   * Start quick reset (breathing exercise)
   * This is always available, even when defocus is locked
   */
  const startQuickReset = (duration = 60) => {
    console.log('🫁 Starting quick reset breathing exercise');
    
    setQuickResetState({
      isActive: true,
      duration: duration,
      remainingTime: duration,
    });

    // Start countdown timer
    const timer = setInterval(() => {
      setQuickResetState(prev => {
        if (prev.remainingTime <= 1) {
          clearInterval(timer);
          return {
            isActive: false,
            duration: duration,
            remainingTime: 0,
          };
        }
        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
        };
      });
    }, 1000);

    return timer;
  };

  /**
   * End quick reset
   */
  const endQuickReset = () => {
    console.log('🫁 Quick reset ended');
    setQuickResetState({
      isActive: false,
      duration: 60,
      remainingTime: 0,
    });
  };

  /**
   * Check if defocus is available
   */
  const isDefocusAvailable = () => {
    return !sessionState.isDefocusLocked;
  };

  /**
   * Get defocus lock message
   */
  const getDefocusLockMessage = () => {
    if (sessionState.isFocusActive) {
      return "🎯 Focus session in progress. Defocus will unlock when you complete your session.";
    }
    if (sessionState.isDefocusUsed) {
      return "✨ You're ready to focus now! Defocus will unlock after your session.";
    }
    return "🌿 Defocus is available!";
  };

  /**
   * Get cycle completion message
   */
  const getCycleCompletionMessage = () => {
    const cycles = sessionState.completedCyclesToday;
    if (cycles === 0) {
      return "🌟 Great start! Complete your first focus cycle today.";
    } else if (cycles === 1) {
      return "🎉 Great job completing your first focus cycle!";
    } else if (cycles < 3) {
      return `🎉 Excellent! You've completed ${cycles} focus cycles today!`;
    } else {
      return `🚀 Amazing! You've completed ${cycles} focus cycles today! You're on fire!`;
    }
  };

  /**
   * Reset session state (for testing or manual reset)
   */
  const resetSessionState = async () => {
    console.log('🔄 Resetting session state');
    setSessionState({
      isFocusActive: false,
      isDefocusUsed: false,
      isDefocusLocked: false,
      currentFocusSession: null,
      completedCyclesToday: 0,
      lastCycleDate: null,
    });
    
    // Clear from AsyncStorage
    try {
      await AsyncStorage.removeItem('focusSessionState');
    } catch (error) {
      console.error('Error clearing session state:', error);
    }
  };

  /**
   * Get session statistics
   */
  const getSessionStats = () => {
    return {
      cyclesCompletedToday: sessionState.completedCyclesToday,
      isDefocusAvailable: isDefocusAvailable(),
      isFocusActive: sessionState.isFocusActive,
      currentFocusSession: sessionState.currentFocusSession,
      quickResetActive: quickResetState.isActive,
      quickResetRemaining: quickResetState.remainingTime,
    };
  };

  const value = {
    // State
    sessionState,
    quickResetState,
    
    // Core functions
    startDefocus,
    endDefocus,
    startFocus,
    endFocus,
    startQuickReset,
    endQuickReset,
    
    // Helper functions
    isDefocusAvailable,
    getDefocusLockMessage,
    getCycleCompletionMessage,
    getSessionStats,
    resetSessionState,
    
    // State flags for easy access
    isDefocusLocked: sessionState.isDefocusLocked,
    isFocusActive: sessionState.isFocusActive,
    isDefocusUsed: sessionState.isDefocusUsed,
    completedCyclesToday: sessionState.completedCyclesToday,
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};
