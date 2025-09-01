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
    defocusTime: 10, // minutes
    pomodoroLength: 25, // minutes
    breakLength: 5, // minutes
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

  // Complete a task and award points/coins
  const completeTask = (taskId) => {
    setUserData(prev => {
      const updatedTodoList = prev.todoList.filter(task => task.id !== taskId);
      const pointsEarned = 10;
      const coinsEarned = 5;
      
      return {
        ...prev,
        todoList: updatedTodoList,
        points: prev.points + pointsEarned,
        coins: prev.coins + coinsEarned,
        completedTasks: prev.completedTasks + 1
      };
    });
  };

  // Add task to todo list
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      text: task,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setUserData(prev => ({
      ...prev,
      todoList: [...prev.todoList, newTask]
    }));
  };

  // Remove task from todo list
  const removeTask = (taskId) => {
    setUserData(prev => ({
      ...prev,
      todoList: prev.todoList.filter(task => task.id !== taskId)
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

  const value = {
    userData,
    addCoins,
    addPoints,
    completeTask,
    addTask,
    removeTask,
    updateDefocusTime,
    updatePomodoroLength,
    addFocusTime,
    updateStreak,
    addAchievement,
    setCurrentTask,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
