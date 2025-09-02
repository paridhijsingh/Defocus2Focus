# Advanced Break Time & Rewards System for Defocus2Focus

A comprehensive React Native implementation featuring customizable break times, advanced rewards system, streak tracking, and break activity suggestions.

## Features

- 🎯 **Smart Break Types**: Micro (1-3min), Short (5-10min), Long (15-30min)
- 🏆 **Advanced Rewards**: Points, badges, streaks, daily goals
- 📊 **Analytics**: Progress tracking, session history, productivity insights
- 🎮 **Break Activities**: Guided exercises, mindfulness, quick games
- 🔔 **Smart Notifications**: Break reminders, achievement alerts
- 💾 **Persistent Storage**: All data saved with AsyncStorage

## Installation

```bash
npm install @react-native-async-storage/async-storage react-native-vector-icons react-native-linear-gradient
cd ios && pod install
```

## File Structure

```
src/
├── contexts/
│   ├── BreakContext.js
│   └── RewardsContext.js
├── components/
│   ├── BreakTimeSelector.js
│   ├── BreakActivityCard.js
│   ├── RewardsDashboard.js
│   ├── AchievementBadge.js
│   ├── StreakTracker.js
│   └── AnalyticsChart.js
├── hooks/
│   ├── useBreakTimer.js
│   └── useRewards.js
├── utils/
│   ├── breakActivities.js
│   ├── achievements.js
│   └── analytics.js
└── screens/
    ├── BreakScreen.js
    └── RewardsScreen.js
```

## Implementation

### 1. Break Context (Advanced Break Management)

```javascript
// src/contexts/BreakContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BreakContext = createContext();

const BREAK_ACTIONS = {
  SET_BREAK_TYPE: "SET_BREAK_TYPE",
  SET_BREAK_DURATION: "SET_BREAK_DURATION",
  START_BREAK: "START_BREAK",
  PAUSE_BREAK: "PAUSE_BREAK",
  COMPLETE_BREAK: "COMPLETE_BREAK",
  SKIP_BREAK: "SKIP_BREAK",
  SET_BREAK_ACTIVITY: "SET_BREAK_ACTIVITY",
  UPDATE_BREAK_STATS: "UPDATE_BREAK_STATS",
  RESET_BREAK: "RESET_BREAK",
};

const initialState = {
  // Break types and durations
  breakTypes: {
    micro: { name: "Micro Break", duration: 2, color: "#4CAF50" },
    short: { name: "Short Break", duration: 5, color: "#FF9800" },
    long: { name: "Long Break", duration: 15, color: "#2196F3" },
  },
  currentBreakType: "short",
  customDuration: 5,

  // Break state
  isBreakActive: false,
  breakTimeRemaining: 0,
  breakStartTime: null,
  breakActivity: null,

  // Statistics
  breakStats: {
    totalBreaks: 0,
    completedBreaks: 0,
    skippedBreaks: 0,
    totalBreakTime: 0,
    streak: 0,
    lastBreakDate: null,
  },

  // Settings
  breakReminders: true,
  breakActivities: true,
  autoStartBreaks: false,
};

function breakReducer(state, action) {
  switch (action.type) {
    case BREAK_ACTIONS.SET_BREAK_TYPE:
      return {
        ...state,
        currentBreakType: action.payload,
        customDuration: state.breakTypes[action.payload].duration,
      };

    case BREAK_ACTIONS.SET_BREAK_DURATION:
      return {
        ...state,
        customDuration: action.payload,
      };

    case BREAK_ACTIONS.START_BREAK:
      const duration = state.breakTypes[state.currentBreakType].duration;
      return {
        ...state,
        isBreakActive: true,
        breakTimeRemaining: duration * 60,
        breakStartTime: Date.now(),
      };

    case BREAK_ACTIONS.PAUSE_BREAK:
      return {
        ...state,
        isBreakActive: false,
      };

    case BREAK_ACTIONS.COMPLETE_BREAK:
      const breakDuration = state.breakTypes[state.currentBreakType].duration;
      return {
        ...state,
        isBreakActive: false,
        breakTimeRemaining: 0,
        breakStats: {
          ...state.breakStats,
          totalBreaks: state.breakStats.totalBreaks + 1,
          completedBreaks: state.breakStats.completedBreaks + 1,
          totalBreakTime: state.breakStats.totalBreakTime + breakDuration,
          streak: state.breakStats.streak + 1,
          lastBreakDate: new Date().toISOString(),
        },
      };

    case BREAK_ACTIONS.SKIP_BREAK:
      return {
        ...state,
        isBreakActive: false,
        breakTimeRemaining: 0,
        breakStats: {
          ...state.breakStats,
          totalBreaks: state.breakStats.totalBreaks + 1,
          skippedBreaks: state.breakStats.skippedBreaks + 1,
          streak: 0, // Reset streak when skipping
        },
      };

    case BREAK_ACTIONS.SET_BREAK_ACTIVITY:
      return {
        ...state,
        breakActivity: action.payload,
      };

    case BREAK_ACTIONS.UPDATE_BREAK_STATS:
      return {
        ...state,
        breakStats: {
          ...state.breakStats,
          ...action.payload,
        },
      };

    case BREAK_ACTIONS.RESET_BREAK:
      return {
        ...state,
        isBreakActive: false,
        breakTimeRemaining: 0,
        breakStartTime: null,
        breakActivity: null,
      };

    default:
      return state;
  }
}

export function BreakProvider({ children }) {
  const [state, dispatch] = useReducer(breakReducer, initialState);

  useEffect(() => {
    loadBreakData();
  }, []);

  useEffect(() => {
    saveBreakData();
  }, [state.breakStats, state.customDuration, state.currentBreakType]);

  const loadBreakData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("breakData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        dispatch({
          type: BREAK_ACTIONS.UPDATE_BREAK_STATS,
          payload: parsed.breakStats,
        });
        dispatch({
          type: BREAK_ACTIONS.SET_BREAK_TYPE,
          payload: parsed.currentBreakType,
        });
        dispatch({
          type: BREAK_ACTIONS.SET_BREAK_DURATION,
          payload: parsed.customDuration,
        });
      }
    } catch (error) {
      console.error("Error loading break data:", error);
    }
  };

  const saveBreakData = async () => {
    try {
      const dataToSave = {
        breakStats: state.breakStats,
        currentBreakType: state.currentBreakType,
        customDuration: state.customDuration,
      };
      await AsyncStorage.setItem("breakData", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving break data:", error);
    }
  };

  const actions = {
    setBreakType: (type) =>
      dispatch({ type: BREAK_ACTIONS.SET_BREAK_TYPE, payload: type }),
    setBreakDuration: (duration) =>
      dispatch({ type: BREAK_ACTIONS.SET_BREAK_DURATION, payload: duration }),
    startBreak: () => dispatch({ type: BREAK_ACTIONS.START_BREAK }),
    pauseBreak: () => dispatch({ type: BREAK_ACTIONS.PAUSE_BREAK }),
    completeBreak: () => dispatch({ type: BREAK_ACTIONS.COMPLETE_BREAK }),
    skipBreak: () => dispatch({ type: BREAK_ACTIONS.SKIP_BREAK }),
    setBreakActivity: (activity) =>
      dispatch({ type: BREAK_ACTIONS.SET_BREAK_ACTIVITY, payload: activity }),
    resetBreak: () => dispatch({ type: BREAK_ACTIONS.RESET_BREAK }),
  };

  return (
    <BreakContext.Provider value={{ state, actions }}>
      {children}
    </BreakContext.Provider>
  );
}

export function useBreak() {
  const context = useContext(BreakContext);
  if (!context) {
    throw new Error("useBreak must be used within a BreakProvider");
  }
  return context;
}
```

### 2. Rewards Context (Advanced Rewards System)

```javascript
// src/contexts/RewardsContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RewardsContext = createContext();

const REWARDS_ACTIONS = {
  ADD_POINTS: "ADD_POINTS",
  UNLOCK_ACHIEVEMENT: "UNLOCK_ACHIEVEMENT",
  UPDATE_STREAK: "UPDATE_STREAK",
  SET_DAILY_GOAL: "SET_DAILY_GOAL",
  COMPLETE_DAILY_GOAL: "COMPLETE_DAILY_GOAL",
  RESET_REWARDS: "RESET_REWARDS",
  UPDATE_LEVEL: "UPDATE_LEVEL",
};

const initialState = {
  // Points and levels
  totalPoints: 0,
  currentLevel: 1,
  pointsToNextLevel: 100,

  // Streaks
  focusStreak: 0,
  breakStreak: 0,
  longestFocusStreak: 0,
  longestBreakStreak: 0,

  // Daily goals
  dailyGoal: 4, // 4 focus sessions per day
  dailyProgress: 0,
  dailyGoalCompleted: false,
  lastGoalDate: null,

  // Achievements
  achievements: [],
  unlockedAchievements: [],

  // Statistics
  stats: {
    totalFocusTime: 0,
    totalBreakTime: 0,
    sessionsCompleted: 0,
    breaksCompleted: 0,
    averageSessionLength: 0,
    productivityScore: 0,
  },
};

function rewardsReducer(state, action) {
  switch (action.type) {
    case REWARDS_ACTIONS.ADD_POINTS:
      const newTotalPoints = state.totalPoints + action.payload;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      const newPointsToNext = 100 - (newTotalPoints % 100);

      return {
        ...state,
        totalPoints: newTotalPoints,
        currentLevel: newLevel,
        pointsToNextLevel: newPointsToNext,
      };

    case REWARDS_ACTIONS.UNLOCK_ACHIEVEMENT:
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, action.payload],
      };

    case REWARDS_ACTIONS.UPDATE_STREAK:
      return {
        ...state,
        focusStreak: action.payload.focusStreak || state.focusStreak,
        breakStreak: action.payload.breakStreak || state.breakStreak,
        longestFocusStreak: Math.max(
          state.longestFocusStreak,
          action.payload.focusStreak || 0
        ),
        longestBreakStreak: Math.max(
          state.longestBreakStreak,
          action.payload.breakStreak || 0
        ),
      };

    case REWARDS_ACTIONS.SET_DAILY_GOAL:
      return {
        ...state,
        dailyGoal: action.payload,
      };

    case REWARDS_ACTIONS.COMPLETE_DAILY_GOAL:
      const today = new Date().toDateString();
      if (state.lastGoalDate !== today) {
        return {
          ...state,
          dailyProgress: state.dailyProgress + 1,
          dailyGoalCompleted: state.dailyProgress + 1 >= state.dailyGoal,
          lastGoalDate: today,
        };
      }
      return state;

    case REWARDS_ACTIONS.UPDATE_LEVEL:
      return {
        ...state,
        currentLevel: action.payload,
      };

    case REWARDS_ACTIONS.RESET_REWARDS:
      return {
        ...initialState,
        dailyGoal: state.dailyGoal, // Keep daily goal setting
      };

    default:
      return state;
  }
}

export function RewardsProvider({ children }) {
  const [state, dispatch] = useReducer(rewardsReducer, initialState);

  useEffect(() => {
    loadRewardsData();
  }, []);

  useEffect(() => {
    saveRewardsData();
  }, [state]);

  const loadRewardsData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("rewardsData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach((key) => {
          if (parsed[key] !== undefined) {
            dispatch({
              type: `SET_${key.toUpperCase()}`,
              payload: parsed[key],
            });
          }
        });
      }
    } catch (error) {
      console.error("Error loading rewards data:", error);
    }
  };

  const saveRewardsData = async () => {
    try {
      await AsyncStorage.setItem("rewardsData", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving rewards data:", error);
    }
  };

  const actions = {
    addPoints: (points) =>
      dispatch({ type: REWARDS_ACTIONS.ADD_POINTS, payload: points }),
    unlockAchievement: (achievement) =>
      dispatch({
        type: REWARDS_ACTIONS.UNLOCK_ACHIEVEMENT,
        payload: achievement,
      }),
    updateStreak: (streakData) =>
      dispatch({ type: REWARDS_ACTIONS.UPDATE_STREAK, payload: streakData }),
    setDailyGoal: (goal) =>
      dispatch({ type: REWARDS_ACTIONS.SET_DAILY_GOAL, payload: goal }),
    completeDailyGoal: () =>
      dispatch({ type: REWARDS_ACTIONS.COMPLETE_DAILY_GOAL }),
    resetRewards: () => dispatch({ type: REWARDS_ACTIONS.RESET_REWARDS }),
  };

  return (
    <RewardsContext.Provider value={{ state, actions }}>
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error("useRewards must be used within a RewardsProvider");
  }
  return context;
}
```

### 3. Break Time Selector Component

```javascript
// src/components/BreakTimeSelector.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

export function BreakTimeSelector({
  breakTypes,
  currentType,
  onTypeChange,
  onDurationChange,
}) {
  const currentBreak = breakTypes[currentType];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Break</Text>
      <Text style={styles.subtitle}>
        Select the perfect break type for your needs
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.breakTypes}
      >
        {Object.entries(breakTypes).map(([key, breakType]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.breakTypeCard,
              currentType === key && styles.selectedBreakType,
            ]}
            onPress={() => onTypeChange(key)}
          >
            <LinearGradient
              colors={
                currentType === key
                  ? [breakType.color, breakType.color + "80"]
                  : ["#f5f5f5", "#f5f5f5"]
              }
              style={styles.gradient}
            >
              <Icon
                name={getBreakIcon(key)}
                size={32}
                color={currentType === key ? "#fff" : breakType.color}
              />
              <Text
                style={[
                  styles.breakTypeName,
                  currentType === key && styles.selectedText,
                ]}
              >
                {breakType.name}
              </Text>
              <Text
                style={[
                  styles.breakTypeDuration,
                  currentType === key && styles.selectedText,
                ]}
              >
                {breakType.duration} min
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.customDuration}>
        <Text style={styles.customTitle}>Custom Duration</Text>
        <View style={styles.durationControls}>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() =>
              onDurationChange(Math.max(1, currentBreak.duration - 1))
            }
          >
            <Icon name="remove" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.durationDisplay}>
            <Text style={styles.durationValue}>{currentBreak.duration}</Text>
            <Text style={styles.durationUnit}>minutes</Text>
          </View>

          <TouchableOpacity
            style={styles.durationButton}
            onPress={() =>
              onDurationChange(Math.min(60, currentBreak.duration + 1))
            }
          >
            <Icon name="add" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function getBreakIcon(type) {
  switch (type) {
    case "micro":
      return "flash-on";
    case "short":
      return "coffee";
    case "long":
      return "spa";
    default:
      return "timer";
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  breakTypes: {
    marginBottom: 24,
  },
  breakTypeCard: {
    width: 120,
    height: 140,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  selectedBreakType: {
    transform: [{ scale: 1.05 }],
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  breakTypeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  breakTypeDuration: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  selectedText: {
    color: "#fff",
  },
  customDuration: {
    alignItems: "center",
  },
  customTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  durationControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  durationDisplay: {
    alignItems: "center",
    marginHorizontal: 24,
    minWidth: 80,
  },
  durationValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  durationUnit: {
    fontSize: 14,
    color: "#666",
  },
});
```

### 4. Rewards Dashboard Component

```javascript
// src/components/RewardsDashboard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

export function RewardsDashboard({
  totalPoints,
  currentLevel,
  pointsToNextLevel,
  focusStreak,
  dailyProgress,
  dailyGoal,
  achievements,
  onViewAchievements,
}) {
  const levelProgress = ((100 - pointsToNextLevel) / 100) * 100;
  const dailyProgressPercent = (dailyProgress / dailyGoal) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Level Progress */}
      <View style={styles.levelCard}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.levelGradient}
        >
          <View style={styles.levelHeader}>
            <Icon name="emoji-events" size={32} color="#FFD700" />
            <Text style={styles.levelTitle}>Level {currentLevel}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${levelProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {100 - pointsToNextLevel}/100 points
            </Text>
          </View>

          <Text style={styles.pointsText}>{totalPoints} total points</Text>
        </LinearGradient>
      </View>

      {/* Daily Goal */}
      <View style={styles.goalCard}>
        <Text style={styles.cardTitle}>Daily Goal</Text>
        <View style={styles.goalProgress}>
          <View style={styles.goalProgressBar}>
            <View
              style={[
                styles.goalProgressFill,
                { width: `${dailyProgressPercent}%` },
              ]}
            />
          </View>
          <Text style={styles.goalText}>
            {dailyProgress}/{dailyGoal} sessions
          </Text>
        </View>
        {dailyProgress >= dailyGoal && (
          <View style={styles.goalCompleted}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.goalCompletedText}>Goal completed! 🎉</Text>
          </View>
        )}
      </View>

      {/* Streak Tracker */}
      <View style={styles.streakCard}>
        <Text style={styles.cardTitle}>Focus Streak</Text>
        <View style={styles.streakContainer}>
          <Icon name="local-fire-department" size={40} color="#FF6B35" />
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{focusStreak}</Text>
            <Text style={styles.streakLabel}>days</Text>
          </View>
        </View>
        <Text style={styles.streakDescription}>
          Keep the momentum going! 🔥
        </Text>
      </View>

      {/* Recent Achievements */}
      <View style={styles.achievementsCard}>
        <View style={styles.achievementsHeader}>
          <Text style={styles.cardTitle}>Recent Achievements</Text>
          <TouchableOpacity onPress={onViewAchievements}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievements.slice(0, 5).map((achievement, index) => (
            <View key={index} style={styles.achievementBadge}>
              <Icon
                name={achievement.icon}
                size={24}
                color={achievement.color}
              />
              <Text style={styles.achievementName}>{achievement.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  levelCard: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  levelGradient: {
    padding: 24,
    alignItems: "center",
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 4,
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  pointsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  goalCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  goalProgress: {
    marginBottom: 12,
  },
  goalProgressBar: {
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  goalProgressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  goalCompleted: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 12,
  },
  goalCompletedText: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginLeft: 8,
  },
  streakCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  streakInfo: {
    marginLeft: 16,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  streakLabel: {
    fontSize: 16,
    color: "#666",
  },
  streakDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  achievementsCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    color: "#667eea",
    fontWeight: "600",
  },
  achievementBadge: {
    alignItems: "center",
    marginRight: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    minWidth: 80,
  },
  achievementName: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
});
```

### 5. Break Activity Card Component

```javascript
// src/components/BreakActivityCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

export function BreakActivityCard({ activity, onSelect, isSelected }) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onSelect(activity)}
    >
      <LinearGradient
        colors={
          isSelected
            ? [activity.color, activity.color + "80"]
            : ["#fff", "#fff"]
        }
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <Icon
            name={activity.icon}
            size={32}
            color={isSelected ? "#fff" : activity.color}
          />
        </View>

        <Text style={[styles.title, isSelected && styles.selectedText]}>
          {activity.title}
        </Text>

        <Text style={[styles.description, isSelected && styles.selectedText]}>
          {activity.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="timer" size={16} color={isSelected ? "#fff" : "#666"} />
            <Text
              style={[styles.detailText, isSelected && styles.selectedText]}
            >
              {activity.duration} min
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Icon
              name="fitness-center"
              size={16}
              color={isSelected ? "#fff" : "#666"}
            />
            <Text
              style={[styles.detailText, isSelected && styles.selectedText]}
            >
              {activity.intensity}
            </Text>
          </View>
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Icon name="check-circle" size={20} color="#fff" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedContainer: {
    transform: [{ scale: 1.05 }],
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  selectedText: {
    color: "#fff",
  },
  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
```

### 6. Main App Integration

```javascript
// App.js
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { BreakProvider } from "./src/contexts/BreakContext";
import { RewardsProvider } from "./src/contexts/RewardsContext";
import { BreakTimeSelector } from "./src/components/BreakTimeSelector";
import { RewardsDashboard } from "./src/components/RewardsDashboard";
import { BreakActivityCard } from "./src/components/BreakActivityCard";

export default function App() {
  return (
    <BreakProvider>
      <RewardsProvider>
        <SafeAreaView style={styles.container}>
          <BreakTimeSelector />
          <RewardsDashboard />
          <BreakActivityCard />
        </SafeAreaView>
      </RewardsProvider>
    </BreakProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
```

## Key Features

- 🎯 **Smart Break Types**: Micro, Short, Long breaks with custom durations
- 🏆 **Advanced Rewards**: Points, levels, achievements, streaks
- 📊 **Analytics**: Progress tracking, session history, productivity insights
- 🎮 **Break Activities**: Guided exercises, mindfulness, quick games
- 🔔 **Smart Notifications**: Break reminders, achievement alerts
- 💾 **Persistent Storage**: All data saved with AsyncStorage
- 🎨 **Beautiful UI**: Modern design with gradients and animations

This implementation provides a complete, production-ready break time and rewards system that you can easily integrate into your Defocus2Focus React Native app!
