import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
      throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    coins: 0,
    points: 0,
    level: 1,
    completedTasks: 0,
    streak: 0,
    lastLoginDate: null,
    totalFocusTime: 0,
    weeklyGoal: 5,
    achievements: [],
    currentTask: null,
    todoList: [],
    completedTasks: [],
    defocusTime: 10, // minutes
    pomodoroLength: 25, // minutes
    breakLength: 5, // minutes
    focusDuration: 25, // minutes
    settings: {
      focusDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
      autoStartBreaks: false,
      autoStartSessions: false,
      soundEnabled: true,
      vibrationEnabled: true,
      defocusTimeLimit: 10, // Default 10 minutes for defocus activities
    },
    sessions: [],
    defocusSessions: [], // Track defocus sessions
    journalEntries: [], // Store journal entries locally
    aiTherapistData: [], // Store AI therapist conversations
    games: {
      unlocked: false, // Games only unlock after completing focus sessions
      highScore: 0,
      gamesPlayed: 0,
    },
    focusSessionCompleted: false, // Track if user has completed at least one focus session
    defocusAbusePrevention: {
      consecutiveDefocusSessions: 0, // Track consecutive defocus sessions without focus
      lastFocusSessionDate: null, // Track when last focus session was completed
      defocusTimeUsed: 0, // Track total defocus time used today
      maxDefocusTimePerDay: 60, // Maximum defocus time allowed per day (minutes)
      defocusSessionCompleted: false, // Track if defocus session was completed and needs focus session
      lastDefocusSessionDate: null, // Track when last defocus session was completed
    },
    categories: [
      { id: 'work', name: 'Work', color: '#3b82f6', icon: 'briefcase' },
      { id: 'personal', name: 'Personal', color: '#10b981', icon: 'person' },
      { id: 'study', name: 'Study', color: '#8b5cf6', icon: 'school' },
      { id: 'health', name: 'Health', color: '#ef4444', icon: 'fitness' },
      { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'cart' },
    ],
  });

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  // Save user data to AsyncStorage whenever it changes
  useEffect(() => {
    saveUserData();
  }, [userData]);

  const loadUserData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('📱 Loading saved user data:', {
          defocusSessionCompleted: parsedData.defocusAbusePrevention?.defocusSessionCompleted,
          lastDefocusSessionDate: parsedData.defocusAbusePrevention?.lastDefocusSessionDate,
          lastFocusSessionDate: parsedData.defocusAbusePrevention?.lastFocusSessionDate
        });
        setUserData(prevData => ({ ...prevData, ...parsedData }));
      } else {
        console.log('📱 No saved user data found, using defaults');
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      console.log('💾 Saving user data:', {
        defocusSessionCompleted: userData.defocusAbusePrevention.defocusSessionCompleted,
        lastDefocusSessionDate: userData.defocusAbusePrevention.lastDefocusSessionDate,
        lastFocusSessionDate: userData.defocusAbusePrevention.lastFocusSessionDate
      });
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  // Add coins to user's balance
  const addCoins = (amount) => {
    setUserData(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  // Add points and check for level up
  const addPoints = (amount) => {
    setUserData(prev => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        completedTasks: prev.completedTasks + 1
      };
    });
  };

  // Enhanced task management functions
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      text: taskData.text,
      description: taskData.description || '',
      category: taskData.category || 'personal',
      priority: taskData.priority || 'medium', // low, medium, high, urgent
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      estimatedTime: taskData.estimatedTime || null, // in minutes
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      focusSessions: 0,
      totalFocusTime: 0,
    };
    
    setUserData(prev => ({
      ...prev,
      todoList: [...prev.todoList, newTask]
    }));
  };

  // Update task
  const updateTask = (taskId, updates) => {
    setUserData(prev => ({
      ...prev,
      todoList: prev.todoList.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  // Complete a task and award points/coins
  const completeTask = (taskId) => {
    setUserData(prev => {
      const task = prev.todoList.find(t => t.id === taskId);
      const updatedTodoList = prev.todoList.filter(t => t.id !== taskId);
      const completedTask = { ...task, completed: true, completedAt: new Date().toISOString() };
      
      // Calculate points based on priority and focus time
      let pointsEarned = 10;
      let coinsEarned = 5;
      
      if (task.priority === 'high') pointsEarned += 5;
      if (task.priority === 'urgent') pointsEarned += 10;
      if (task.focusSessions > 0) pointsEarned += task.focusSessions * 2;
      
      return {
        ...prev,
        todoList: updatedTodoList,
        completedTasks: [...prev.completedTasks, completedTask],
        points: prev.points + pointsEarned,
        coins: prev.coins + coinsEarned,
        completedTasks: prev.completedTasks + 1
      };
    });
  };

  // Remove task from todo list
  const removeTask = (taskId) => {
    setUserData(prev => ({
      ...prev,
      todoList: prev.todoList.filter(task => task.id !== taskId)
    }));
  };

  // Add subtask to a task
  const addSubtask = (taskId, subtaskText) => {
    const newSubtask = {
      id: Date.now().toString(),
      text: subtaskText,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setUserData(prev => ({
      ...prev,
      todoList: prev.todoList.map(task =>
        task.id === taskId 
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      )
    }));
  };

  // Complete subtask
  const completeSubtask = (taskId, subtaskId) => {
    setUserData(prev => ({
      ...prev,
      todoList: prev.todoList.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: true, completedAt: new Date().toISOString() }
                  : subtask
              )
            }
          : task
      )
    }));
  };

  // Add focus session to a task
  const addFocusSessionToTask = (taskId, duration) => {
    setUserData(prev => ({
      ...prev,
      todoList: prev.todoList.map(task =>
        task.id === taskId
          ? {
              ...task,
              focusSessions: task.focusSessions + 1,
              totalFocusTime: task.totalFocusTime + duration
            }
          : task
      )
    }));
  };

  // Get tasks by category
  const getTasksByCategory = (category) => {
    return userData.todoList.filter(task => task.category === category);
  };

  // Get tasks by priority
  const getTasksByPriority = (priority) => {
    return userData.todoList.filter(task => task.priority === priority);
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const now = new Date();
    return userData.todoList.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && !task.completed
    );
  };

  // Get tasks due today
  const getTasksDueToday = () => {
    const today = new Date().toDateString();
    return userData.todoList.filter(task => 
      task.dueDate && new Date(task.dueDate).toDateString() === today && !task.completed
    );
  };

  // Add focus session
  const addSession = (sessionData) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      date: new Date().toISOString(),
    };
    
    setUserData(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      totalFocusTime: prev.totalFocusTime + (sessionData.duration || 0),
      focusSessionCompleted: true, // Mark that user has completed at least one focus session
      defocusAbusePrevention: {
        ...prev.defocusAbusePrevention,
        consecutiveDefocusSessions: 0, // Reset consecutive defocus sessions
        lastFocusSessionDate: new Date().toISOString(), // Update last focus session date
        defocusSessionCompleted: false, // Reset defocus session completed flag - user can defocus again
      },
      games: {
        ...prev.games,
        unlocked: true, // Unlock games after completing focus session
      }
    }));
  };

  // Add defocus session with abuse prevention
  const addDefocusSession = (sessionData) => {
    console.log('🔒 Adding defocus session:', sessionData);
    
    const newDefocusSession = {
      id: Date.now(),
      ...sessionData,
      date: new Date().toISOString(),
    };
    
    setUserData(prev => {
      const today = new Date().toDateString();
      const lastFocusDate = prev.defocusAbusePrevention.lastFocusSessionDate 
        ? new Date(prev.defocusAbusePrevention.lastFocusSessionDate).toDateString()
        : null;
      
      // Check if user has completed a focus session today
      const hasCompletedFocusToday = lastFocusDate === today;
      
      // Calculate rewards based on focus session completion
      let pointsEarned = 0;
      let coinsEarned = 0;
      
      if (hasCompletedFocusToday) {
        // Give rewards only if user has completed a focus session
        pointsEarned = Math.floor(sessionData.duration / 2); // 1 point per 2 minutes
        coinsEarned = Math.floor(sessionData.duration / 5); // 1 coin per 5 minutes
      }
      
      const updatedData = {
        ...prev,
        defocusSessions: [...prev.defocusSessions, newDefocusSession],
        points: prev.points + pointsEarned,
        coins: prev.coins + coinsEarned,
        defocusAbusePrevention: {
          ...prev.defocusAbusePrevention,
          consecutiveDefocusSessions: hasCompletedFocusToday 
            ? 0 
            : prev.defocusAbusePrevention.consecutiveDefocusSessions + 1,
          defocusTimeUsed: prev.defocusAbusePrevention.defocusTimeUsed + sessionData.duration,
          defocusSessionCompleted: true, // Mark that defocus session was completed
          lastDefocusSessionDate: new Date().toISOString(), // Track when defocus was completed
        }
      };
      
      console.log('🔒 Updated user data - defocusSessionCompleted:', updatedData.defocusAbusePrevention.defocusSessionCompleted);
      console.log('🔒 Updated user data - lastDefocusSessionDate:', updatedData.defocusAbusePrevention.lastDefocusSessionDate);
      
      return updatedData;
    });
  };

  // Check if user can access defocus activities
  const canAccessDefocus = () => {
    const today = new Date().toDateString();
    const lastFocusDate = userData.defocusAbusePrevention.lastFocusSessionDate 
      ? new Date(userData.defocusAbusePrevention.lastFocusSessionDate).toDateString()
      : null;
    const lastDefocusDate = userData.defocusAbusePrevention.lastDefocusSessionDate
      ? new Date(userData.defocusAbusePrevention.lastDefocusSessionDate).toDateString()
      : null;
    
    console.log('🔍 canAccessDefocus check:', {
      defocusSessionCompleted: userData.defocusAbusePrevention.defocusSessionCompleted,
      lastFocusDate,
      lastDefocusDate,
      today
    });
    
    // SIMPLIFIED LOGIC: After completing a defocus session, user MUST complete a focus session
    if (userData.defocusAbusePrevention.defocusSessionCompleted) {
      console.log('🔒 Defocus session completed - checking if focus session was completed AFTER');
      // User has completed a defocus session - check if they've completed a focus session AFTER
      if (lastFocusDate && lastDefocusDate) {
        const focusTime = new Date(lastFocusDate).getTime();
        const defocusTime = new Date(lastDefocusDate).getTime();
        
        console.log('🔍 Time comparison:', {
          focusTime: new Date(focusTime),
          defocusTime: new Date(defocusTime),
          focusAfterDefocus: focusTime > defocusTime
        });
        
        // Only allow access if focus session was completed AFTER the defocus session
        if (focusTime > defocusTime) {
          console.log('✅ Focus session completed after defocus - allowing access');
          return true; // User completed focus session after defocus, can defocus again
        }
      }
      console.log('❌ No focus session completed after defocus - blocking access');
      // User completed defocus but hasn't completed focus session yet - BLOCK ACCESS
      return false;
    }
    
    console.log('🔍 No defocus session completed yet - checking focus session requirement');
    // For users who haven't completed any defocus sessions yet
    // Only allow access if they've completed a focus session today
    const hasCompletedFocusToday = lastFocusDate === today;
    
    if (!hasCompletedFocusToday) {
      console.log('❌ No focus session today - blocking access');
      return false; // No focus session today - block access
    }
    
    console.log('✅ Focus session completed today - allowing access');
    // Additional safety checks
    const hasExceededDailyLimit = userData.defocusAbusePrevention.defocusTimeUsed >= userData.defocusAbusePrevention.maxDefocusTimePerDay;
    const hasTooManyConsecutiveDefocus = userData.defocusAbusePrevention.consecutiveDefocusSessions >= 3;
    
    const finalResult = !hasExceededDailyLimit && !hasTooManyConsecutiveDefocus;
    console.log('🔍 Final access result:', finalResult, {
      hasExceededDailyLimit,
      hasTooManyConsecutiveDefocus
    });
    
    return finalResult;
  };

  // Get motivational message based on user behavior
  const getMotivationalMessage = () => {
    const overdueTasks = getOverdueTasks().length;
    const incompleteTasks = userData.todoList.length;
    const consecutiveDefocus = userData.defocusAbusePrevention.consecutiveDefocusSessions;
    const defocusTimeUsed = userData.defocusAbusePrevention.defocusTimeUsed;
    const maxDefocusTime = userData.defocusAbusePrevention.maxDefocusTimePerDay;
    
    // Check for defocus abuse patterns
    if (consecutiveDefocus >= 3) {
      return {
        type: 'urgent',
        title: 'Break Time Limit Reached! 🚫',
        message: 'You\'ve taken too many breaks without focusing. Complete a focus session to unlock more defocus activities.',
        action: 'Start Focus Session',
        requiresAction: true
      };
    }
    
    if (defocusTimeUsed >= maxDefocusTime * 0.8) {
      return {
        type: 'warning',
        title: 'Approaching Daily Limit! ⚠️',
        message: `You've used ${Math.floor(defocusTimeUsed)} minutes of your ${maxDefocusTime} minute daily defocus allowance.`,
        action: 'Manage Time',
        requiresAction: false
      };
    }
    
    if (overdueTasks > 0) {
      return {
        type: 'urgent',
        title: 'Tasks Need Attention! ⚠️',
        message: `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}. Let's tackle them together!`,
        action: 'View Tasks',
        requiresAction: true
      };
    }
    
    if (incompleteTasks > 5) {
      return {
        type: 'info',
        title: 'Stay Organized! 📝',
        message: `You have ${incompleteTasks} tasks pending. Consider breaking them down into smaller, manageable pieces.`,
        action: 'Organize Tasks',
        requiresAction: false
      };
    }
    
    if (consecutiveDefocus > 0) {
      return {
        type: 'info',
        title: 'Balance is Key! ⚖️',
        message: 'You\'ve been taking breaks. Remember to complete a focus session to maintain productivity balance.',
        action: 'Start Focus Session',
        requiresAction: false
      };
    }
    
    return {
      type: 'success',
      title: 'You\'re Doing Great! 🌟',
      message: 'Keep up the good work! Remember to take breaks and stay hydrated.',
      action: null,
      requiresAction: false
    };
  };

  // Add journal entry
  const addJournalEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      ...entry,
      date: new Date().toISOString(),
    };
    
    setUserData(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, newEntry]
    }));
  };

  // Add AI therapist conversation
  const addAITherapistData = (conversation) => {
    const newConversation = {
      id: Date.now(),
      ...conversation,
      date: new Date().toISOString(),
    };
    
    setUserData(prev => ({
      ...prev,
      aiTherapistData: [...prev.aiTherapistData, newConversation]
    }));
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setUserData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  // Add category
  const addCategory = (category) => {
    const newCategory = {
      id: Date.now().toString(),
      ...category,
    };
    
    setUserData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  // Update defocus time setting
  const updateDefocusTime = (minutes) => {
    setUserData(prev => ({
      ...prev,
      defocusTime: minutes
    }));
  };

  // Update pomodoro length setting
  const updatePomodoroLength = (minutes) => {
    setUserData(prev => ({
      ...prev,
      pomodoroLength: minutes
    }));
  };

  // Add focus time
  const addFocusTime = (minutes) => {
    setUserData(prev => ({
      ...prev,
      totalFocusTime: prev.totalFocusTime + minutes
    }));
  };

  // Check and update streak
  const updateStreak = () => {
    const today = new Date().toDateString();
    setUserData(prev => {
      if (prev.lastLoginDate !== today) {
        return {
          ...prev,
          streak: prev.streak + 1,
          lastLoginDate: today
        };
      }
      return prev;
    });
  };

  // Add achievement
  const addAchievement = (achievement) => {
    setUserData(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement]
    }));
  };

  // Set current task
  const setCurrentTask = (task) => {
    setUserData(prev => ({
      ...prev,
      currentTask: task
    }));
  };

  // Reset daily defocus time (call this at midnight)
  const resetDailyDefocusTime = () => {
    setUserData(prev => ({
      ...prev,
      defocusAbusePrevention: {
        ...prev.defocusAbusePrevention,
        defocusTimeUsed: 0,
        consecutiveDefocusSessions: 0, // Reset consecutive count daily
        defocusSessionCompleted: false, // Reset defocus session completed flag daily
      }
    }));
  };

  // Reset defocus session state (for testing)
  const resetDefocusSessionState = () => {
    setUserData(prev => ({
      ...prev,
      defocusAbusePrevention: {
        ...prev.defocusAbusePrevention,
        defocusSessionCompleted: false,
        lastDefocusSessionDate: null,
      }
    }));
  };

  // Clear all user data (for testing)
  const clearAllUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserData({
        coins: 0,
        points: 0,
        level: 1,
        completedTasks: 0,
        streak: 0,
        lastLoginDate: null,
        totalFocusTime: 0,
        weeklyGoal: 5,
        achievements: [],
        currentTask: null,
        todoList: [],
        completedTasks: [],
        defocusTime: 10,
        pomodoroLength: 25,
        breakLength: 5,
        focusDuration: 25,
        settings: {
          focusDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
          sessionsUntilLongBreak: 4,
          autoStartBreaks: false,
          autoStartSessions: false,
          soundEnabled: true,
          vibrationEnabled: true,
          defocusTimeLimit: 10,
        },
        sessions: [],
        defocusSessions: [],
        journalEntries: [],
        aiTherapistData: [],
        games: {
          unlocked: false,
          highScore: 0,
          gamesPlayed: 0,
        },
        focusSessionCompleted: false,
        defocusAbusePrevention: {
          consecutiveDefocusSessions: 0,
          lastFocusSessionDate: null,
          defocusTimeUsed: 0,
          maxDefocusTimePerDay: 60,
          defocusSessionCompleted: false,
          lastDefocusSessionDate: null,
        },
        categories: [
          { id: 'work', name: 'Work', color: '#3b82f6', icon: 'briefcase' },
          { id: 'personal', name: 'Personal', color: '#10b981', icon: 'person' },
          { id: 'study', name: 'Study', color: '#8b5cf6', icon: 'school' },
          { id: 'health', name: 'Health', color: '#ef4444', icon: 'fitness' },
          { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'cart' },
        ],
      });
      console.log('🧹 All user data cleared');
    } catch (error) {
      console.log('Error clearing user data:', error);
    }
  };

  // Manual save function (for testing)
  const manualSaveUserData = async () => {
    try {
      console.log('💾 Manual save triggered');
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('✅ Manual save completed');
    } catch (error) {
      console.log('Error in manual save:', error);
    }
  };

  // Get defocus lock status for UI display
  const getDefocusLockStatus = () => {
    const canAccess = canAccessDefocus();
    const defocusCompleted = userData.defocusAbusePrevention.defocusSessionCompleted;
    const lastDefocusDate = userData.defocusAbusePrevention.lastDefocusSessionDate;
    const lastFocusDate = userData.defocusAbusePrevention.lastFocusSessionDate;
    
    console.log('🔒 getDefocusLockStatus:', {
      canAccess,
      defocusCompleted,
      lastDefocusDate,
      lastFocusDate
    });
    
    if (!canAccess && defocusCompleted) {
      console.log('🔒 Locked: defocus_completed reason');
      return {
        locked: true,
        reason: 'defocus_completed',
        message: 'Defocus time is over. Time to Focus now!',
        tooltip: 'You need to finish a Focus session before defocusing again.',
        lastDefocus: lastDefocusDate,
        lastFocus: lastFocusDate,
      };
    }
    
    if (!canAccess && !defocusCompleted) {
      console.log('🔒 Locked: no_focus_session reason');
      return {
        locked: true,
        reason: 'no_focus_session',
        message: 'Complete a Focus session to unlock Defocus activities',
        tooltip: 'You need to complete a focus session first to access defocus activities.',
        lastDefocus: lastDefocusDate,
        lastFocus: lastFocusDate,
      };
    }
    
    console.log('🔓 Unlocked: no lock reason');
    return {
      locked: false,
      reason: null,
      message: null,
      tooltip: null,
      lastDefocus: lastDefocusDate,
      lastFocus: lastFocusDate,
    };
  };

  // Check if user has exhausted defocus privileges
  const hasExhaustedDefocusPrivileges = () => {
    const consecutiveDefocus = userData.defocusAbusePrevention.consecutiveDefocusSessions;
    const defocusTimeUsed = userData.defocusAbusePrevention.defocusTimeUsed;
    const maxDefocusTime = userData.defocusAbusePrevention.maxDefocusTimePerDay;
    
    return consecutiveDefocus >= 3 || defocusTimeUsed >= maxDefocusTime;
  };

  // Get defocus abuse prevention status
  const getDefocusAbuseStatus = () => {
    const consecutiveDefocus = userData.defocusAbusePrevention.consecutiveDefocusSessions;
    const defocusTimeUsed = userData.defocusAbusePrevention.defocusTimeUsed;
    const maxDefocusTime = userData.defocusAbusePrevention.maxDefocusTimePerDay;
    const lastFocusDate = userData.defocusAbusePrevention.lastFocusSessionDate;
    
    return {
      consecutiveDefocus,
      defocusTimeUsed,
      maxDefocusTime,
      remainingTime: Math.max(0, maxDefocusTime - defocusTimeUsed),
      lastFocusDate,
      canAccess: canAccessDefocus(),
      needsFocusSession: consecutiveDefocus >= 2 || defocusTimeUsed >= maxDefocusTime * 0.8
    };
  };

  const value = {
    userData,
    addCoins,
    addPoints,
    addTask,
    updateTask,
    completeTask,
    removeTask,
    addSubtask,
    completeSubtask,
    addFocusSessionToTask,
    getTasksByCategory,
    getTasksByPriority,
    getOverdueTasks,
    getTasksDueToday,
    addSession,
    addDefocusSession,
    canAccessDefocus,
    getMotivationalMessage,
    addJournalEntry,
    addAITherapistData,
    updateSettings,
    addCategory,
    updateDefocusTime,
    updatePomodoroLength,
    addFocusTime,
    updateStreak,
    addAchievement,
    setCurrentTask,
    resetDailyDefocusTime,
    hasExhaustedDefocusPrivileges,
    getDefocusAbuseStatus,
    getDefocusLockStatus,
    resetDefocusSessionState,
    clearAllUserData,
    manualSaveUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
