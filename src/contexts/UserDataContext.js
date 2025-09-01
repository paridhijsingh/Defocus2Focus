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
        setUserData(prevData => ({ ...prevData, ...parsedData }));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
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
      },
      games: {
        ...prev.games,
        unlocked: true, // Unlock games after completing focus session
      }
    }));
  };

  // Add defocus session with abuse prevention
  const addDefocusSession = (sessionData) => {
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
      
      return {
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
        }
      };
    });
  };

  // Check if user can access defocus activities
  const canAccessDefocus = () => {
    const today = new Date().toDateString();
    const lastFocusDate = userData.defocusAbusePrevention.lastFocusSessionDate 
      ? new Date(userData.defocusAbusePrevention.lastFocusSessionDate).toDateString()
      : null;
    
    // Allow access if:
    // 1. User has completed a focus session today, OR
    // 2. User hasn't exceeded daily defocus time limit
    const hasCompletedFocusToday = lastFocusDate === today;
    const hasExceededDailyLimit = userData.defocusAbusePrevention.defocusTimeUsed >= userData.defocusAbusePrevention.maxDefocusTimePerDay;
    
    return hasCompletedFocusToday || !hasExceededDailyLimit;
  };

  // Get motivational message based on user behavior
  const getMotivationalMessage = () => {
    const overdueTasks = getOverdueTasks().length;
    const incompleteTasks = userData.todoList.length;
    const consecutiveDefocus = userData.defocusAbusePrevention.consecutiveDefocusSessions;
    
    if (consecutiveDefocus > 2) {
      return {
        type: 'warning',
        title: 'Time to Focus! 🎯',
        message: 'You\'ve been taking a lot of breaks. Remember, balance is key! Try completing a focus session to unlock more rewards.',
        action: 'Start Focus Session'
      };
    }
    
    if (overdueTasks > 0) {
      return {
        type: 'urgent',
        title: 'Tasks Need Attention! ⚠️',
        message: `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}. Let's tackle them together!`,
        action: 'View Tasks'
      };
    }
    
    if (incompleteTasks > 5) {
      return {
        type: 'info',
        title: 'Stay Organized! 📝',
        message: `You have ${incompleteTasks} tasks pending. Consider breaking them down into smaller, manageable pieces.`,
        action: 'Organize Tasks'
      };
    }
    
    return {
      type: 'success',
      title: 'You\'re Doing Great! 🌟',
      message: 'Keep up the good work! Remember to take breaks and stay hydrated.',
      action: null
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
      }
    }));
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
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
