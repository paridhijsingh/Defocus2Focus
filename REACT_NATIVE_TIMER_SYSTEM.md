# React Native Timer System for Defocus2Focus

This implementation provides a complete timer system with customizable break times and a rewards system for your React Native Defocus2Focus app.

## Features

- ✅ Customizable break duration (default: 5 minutes)
- ✅ Focus session timer (default: 25 minutes)
- ✅ Rewards/points system (1 point per 5 minutes of focus)
- ✅ Notifications when points are earned
- ✅ Persistent storage using AsyncStorage
- ✅ Modular, easy-to-integrate components

## Installation

First, install the required dependencies:

```bash
npm install @react-native-async-storage/async-storage react-native-vector-icons
# For iOS
cd ios && pod install
```

## File Structure

```
src/
├── contexts/
│   └── TimerContext.js
├── components/
│   ├── TimerDisplay.js
│   ├── BreakDurationSelector.js
│   ├── RewardsDisplay.js
│   └── NotificationToast.js
├── hooks/
│   └── useTimer.js
└── utils/
    └── storage.js
```

## Implementation

### 1. Timer Context (State Management)

```javascript
// src/contexts/TimerContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimerContext = createContext();

// Action types
const TIMER_ACTIONS = {
  SET_FOCUS_DURATION: "SET_FOCUS_DURATION",
  SET_BREAK_DURATION: "SET_BREAK_DURATION",
  START_TIMER: "START_TIMER",
  PAUSE_TIMER: "PAUSE_TIMER",
  STOP_TIMER: "STOP_TIMER",
  TICK: "TICK",
  COMPLETE_SESSION: "COMPLETE_SESSION",
  ADD_POINTS: "ADD_POINTS",
  RESET_TIMER: "RESET_TIMER",
};

// Initial state
const initialState = {
  // Timer states
  focusDuration: 25, // minutes
  breakDuration: 5, // minutes
  currentTime: 0, // seconds
  isRunning: false,
  isFocusSession: true,
  isCompleted: false,

  // Rewards system
  totalPoints: 0,
  sessionPoints: 0,

  // UI states
  showNotification: false,
  notificationMessage: "",
};

// Reducer
function timerReducer(state, action) {
  switch (action.type) {
    case TIMER_ACTIONS.SET_FOCUS_DURATION:
      return { ...state, focusDuration: action.payload };

    case TIMER_ACTIONS.SET_BREAK_DURATION:
      return { ...state, breakDuration: action.payload };

    case TIMER_ACTIONS.START_TIMER:
      return { ...state, isRunning: true, isCompleted: false };

    case TIMER_ACTIONS.PAUSE_TIMER:
      return { ...state, isRunning: false };

    case TIMER_ACTIONS.STOP_TIMER:
      return {
        ...state,
        isRunning: false,
        currentTime: 0,
        isCompleted: false,
        sessionPoints: 0,
      };

    case TIMER_ACTIONS.TICK:
      const newTime = state.currentTime + 1;
      const sessionDuration = state.isFocusSession
        ? state.focusDuration
        : state.breakDuration;
      const isSessionComplete = newTime >= sessionDuration * 60;

      return {
        ...state,
        currentTime: newTime,
        isCompleted: isSessionComplete,
      };

    case TIMER_ACTIONS.COMPLETE_SESSION:
      const pointsEarned = Math.floor(state.focusDuration / 5);
      return {
        ...state,
        isRunning: false,
        isFocusSession: !state.isFocusSession,
        currentTime: 0,
        totalPoints: state.totalPoints + pointsEarned,
        sessionPoints: pointsEarned,
        showNotification: true,
        notificationMessage: `🎉 Great job! You earned ${pointsEarned} points!`,
      };

    case TIMER_ACTIONS.ADD_POINTS:
      return {
        ...state,
        totalPoints: state.totalPoints + action.payload,
      };

    case TIMER_ACTIONS.RESET_TIMER:
      return {
        ...state,
        currentTime: 0,
        isRunning: false,
        isFocusSession: true,
        isCompleted: false,
        sessionPoints: 0,
      };

    default:
      return state;
  }
}

// Provider component
export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load saved data on app start
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    saveData();
  }, [state.focusDuration, state.breakDuration, state.totalPoints]);

  const loadSavedData = async () => {
    try {
      const savedFocusDuration = await AsyncStorage.getItem("focusDuration");
      const savedBreakDuration = await AsyncStorage.getItem("breakDuration");
      const savedTotalPoints = await AsyncStorage.getItem("totalPoints");

      if (savedFocusDuration) {
        dispatch({
          type: TIMER_ACTIONS.SET_FOCUS_DURATION,
          payload: parseInt(savedFocusDuration),
        });
      }
      if (savedBreakDuration) {
        dispatch({
          type: TIMER_ACTIONS.SET_BREAK_DURATION,
          payload: parseInt(savedBreakDuration),
        });
      }
      if (savedTotalPoints) {
        dispatch({
          type: TIMER_ACTIONS.ADD_POINTS,
          payload: parseInt(savedTotalPoints),
        });
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        "focusDuration",
        state.focusDuration.toString()
      );
      await AsyncStorage.setItem(
        "breakDuration",
        state.breakDuration.toString()
      );
      await AsyncStorage.setItem("totalPoints", state.totalPoints.toString());
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Action creators
  const actions = {
    setFocusDuration: (duration) =>
      dispatch({ type: TIMER_ACTIONS.SET_FOCUS_DURATION, payload: duration }),

    setBreakDuration: (duration) =>
      dispatch({ type: TIMER_ACTIONS.SET_BREAK_DURATION, payload: duration }),

    startTimer: () => dispatch({ type: TIMER_ACTIONS.START_TIMER }),

    pauseTimer: () => dispatch({ type: TIMER_ACTIONS.PAUSE_TIMER }),

    stopTimer: () => dispatch({ type: TIMER_ACTIONS.STOP_TIMER }),

    tick: () => dispatch({ type: TIMER_ACTIONS.TICK }),

    completeSession: () => dispatch({ type: TIMER_ACTIONS.COMPLETE_SESSION }),

    resetTimer: () => dispatch({ type: TIMER_ACTIONS.RESET_TIMER }),

    hideNotification: () => dispatch({ type: "HIDE_NOTIFICATION" }),
  };

  return (
    <TimerContext.Provider value={{ state, actions }}>
      {children}
    </TimerContext.Provider>
  );
}

// Custom hook to use timer context
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
```

### 2. Custom Timer Hook

```javascript
// src/hooks/useTimer.js
import { useEffect, useRef } from "react";
import { useTimer as useTimerContext } from "../contexts/TimerContext";

export function useTimer() {
  const { state, actions } = useTimerContext();
  const intervalRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (state.isRunning && !state.isCompleted) {
      intervalRef.current = setInterval(() => {
        actions.tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isCompleted]);

  // Auto-complete session when time is up
  useEffect(() => {
    if (state.isCompleted && state.isRunning) {
      actions.completeSession();
    }
  }, [state.isCompleted, state.isRunning]);

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getRemainingTime = () => {
    const sessionDuration = state.isFocusSession
      ? state.focusDuration
      : state.breakDuration;
    const totalSeconds = sessionDuration * 60;
    return totalSeconds - state.currentTime;
  };

  const getProgress = () => {
    const sessionDuration = state.isFocusSession
      ? state.focusDuration
      : state.breakDuration;
    const totalSeconds = sessionDuration * 60;
    return (state.currentTime / totalSeconds) * 100;
  };

  return {
    ...state,
    ...actions,
    formatTime,
    getRemainingTime,
    getProgress,
  };
}
```

### 3. Break Duration Selector Component

```javascript
// src/components/BreakDurationSelector.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export function BreakDurationSelector({ breakDuration, onDurationChange }) {
  const durations = [3, 5, 10, 15, 20, 30]; // minutes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Break Duration</Text>
      <Text style={styles.subtitle}>
        Choose your break time after focus sessions
      </Text>

      <View style={styles.durationGrid}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationButton,
              breakDuration === duration && styles.selectedButton,
            ]}
            onPress={() => onDurationChange(duration)}
          >
            <Text
              style={[
                styles.durationText,
                breakDuration === duration && styles.selectedText,
              ]}
            >
              {duration}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.customDuration}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => onDurationChange(Math.max(1, breakDuration - 1))}
        >
          <Icon name="remove" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.currentDuration}>{breakDuration} minutes</Text>

        <TouchableOpacity
          style={styles.customButton}
          onPress={() => onDurationChange(Math.min(60, breakDuration + 1))}
        >
          <Icon name="add" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  durationButton: {
    width: "30%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  durationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  selectedText: {
    color: "#fff",
  },
  customDuration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  customButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  currentDuration: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 20,
    minWidth: 80,
    textAlign: "center",
  },
});
```

### 4. Rewards Display Component

```javascript
// src/components/RewardsDisplay.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export function RewardsDisplay({ totalPoints, sessionPoints, onReset }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="emoji-events" size={24} color="#FFD700" />
        <Text style={styles.title}>Your Rewards</Text>
      </View>

      <View style={styles.pointsContainer}>
        <View style={styles.totalPoints}>
          <Text style={styles.pointsLabel}>Total Points</Text>
          <Text style={styles.pointsValue}>{totalPoints}</Text>
        </View>

        {sessionPoints > 0 && (
          <View style={styles.sessionPoints}>
            <Text style={styles.sessionLabel}>This Session</Text>
            <Text style={styles.sessionValue}>+{sessionPoints}</Text>
          </View>
        )}
      </View>

      <View style={styles.achievements}>
        <Text style={styles.achievementTitle}>Achievements</Text>
        <View style={styles.achievementList}>
          <AchievementItem
            icon="local-fire-department"
            title="Focus Master"
            description="Complete 10 focus sessions"
            isUnlocked={totalPoints >= 50}
          />
          <AchievementItem
            icon="self-improvement"
            title="Zen Master"
            description="Complete 25 focus sessions"
            isUnlocked={totalPoints >= 125}
          />
          <AchievementItem
            icon="psychology"
            title="Mind Master"
            description="Complete 50 focus sessions"
            isUnlocked={totalPoints >= 250}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Icon name="refresh" size={20} color="#666" />
        <Text style={styles.resetText}>Reset Points</Text>
      </TouchableOpacity>
    </View>
  );
}

function AchievementItem({ icon, title, description, isUnlocked }) {
  return (
    <View
      style={[styles.achievementItem, !isUnlocked && styles.lockedAchievement]}
    >
      <Icon name={icon} size={20} color={isUnlocked ? "#4CAF50" : "#ccc"} />
      <View style={styles.achievementText}>
        <Text
          style={[styles.achievementTitle, !isUnlocked && styles.lockedText]}
        >
          {title}
        </Text>
        <Text
          style={[styles.achievementDesc, !isUnlocked && styles.lockedText]}
        >
          {description}
        </Text>
      </View>
      {isUnlocked && <Icon name="check-circle" size={20} color="#4CAF50" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  pointsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalPoints: {
    alignItems: "center",
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  sessionPoints: {
    alignItems: "center",
    flex: 1,
  },
  sessionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  sessionValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9800",
  },
  achievements: {
    marginBottom: 20,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  achievementList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementText: {
    flex: 1,
    marginLeft: 12,
  },
  achievementDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  lockedText: {
    color: "#ccc",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  resetText: {
    marginLeft: 8,
    color: "#666",
    fontWeight: "500",
  },
});
```

### 5. Notification Toast Component

```javascript
// src/components/NotificationToast.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export function NotificationToast({
  visible,
  message,
  type = "success",
  onHide,
}) {
  const slideAnim = new Animated.Value(-100);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      hideNotification();
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      default:
        return "#2196F3";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={hideNotification}
        activeOpacity={0.8}
      >
        <Icon name={getIcon()} size={24} color="#fff" />
        <Text style={styles.message}>{message}</Text>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  message: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    marginRight: 8,
  },
});
```

### 6. Main Timer Display Component

```javascript
// src/components/TimerDisplay.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export function TimerDisplay({
  isFocusSession,
  remainingTime,
  isRunning,
  isCompleted,
  progress,
  onStart,
  onPause,
  onStop,
  onReset,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getSessionType = () => {
    return isFocusSession ? "Focus" : "Break";
  };

  const getSessionColor = () => {
    return isFocusSession ? "#4CAF50" : "#FF9800";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sessionType, { color: getSessionColor() }]}>
          {getSessionType()} Session
        </Text>
        <Text style={styles.timeRemaining}>{formatTime(remainingTime)}</Text>
      </View>

      {/* Progress Circle */}
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressCircle, { borderColor: getSessionColor() }]}
        >
          <Text style={[styles.progressText, { color: getSessionColor() }]}>
            {Math.round(progress)}%
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={onStart}
          >
            <Icon name="play-arrow" size={32} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={onPause}
          >
            <Icon name="pause" size={32} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={onStop}
        >
          <Icon name="stop" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={onReset}
        >
          <Icon name="refresh" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {isCompleted && (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>
            🎉 {getSessionType()} session completed!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    margin: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  sessionType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeRemaining: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "monospace",
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  progressText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#FF9800",
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  resetButton: {
    backgroundColor: "#f0f0f0",
  },
  completedContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
  },
  completedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
});
```

### 7. Main App Integration

```javascript
// App.js
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { TimerProvider, useTimer } from "./src/contexts/TimerContext";
import { TimerDisplay } from "./src/components/TimerDisplay";
import { BreakDurationSelector } from "./src/components/BreakDurationSelector";
import { RewardsDisplay } from "./src/components/RewardsDisplay";
import { NotificationToast } from "./src/components/NotificationToast";

function AppContent() {
  const {
    // State
    focusDuration,
    breakDuration,
    currentTime,
    isRunning,
    isFocusSession,
    isCompleted,
    totalPoints,
    sessionPoints,
    showNotification,
    notificationMessage,

    // Actions
    setBreakDuration,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    hideNotification,

    // Helpers
    formatTime,
    getRemainingTime,
    getProgress,
  } = useTimer();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Timer Display */}
        <TimerDisplay
          isFocusSession={isFocusSession}
          remainingTime={getRemainingTime()}
          isRunning={isRunning}
          isCompleted={isCompleted}
          progress={getProgress()}
          onStart={startTimer}
          onPause={pauseTimer}
          onStop={stopTimer}
          onReset={resetTimer}
        />

        {/* Break Duration Selector */}
        <BreakDurationSelector
          breakDuration={breakDuration}
          onDurationChange={setBreakDuration}
        />

        {/* Rewards Display */}
        <RewardsDisplay
          totalPoints={totalPoints}
          sessionPoints={sessionPoints}
          onReset={() => {
            // Reset points logic
            setTotalPoints(0);
          }}
        />
      </ScrollView>

      {/* Notification Toast */}
      <NotificationToast
        visible={showNotification}
        message={notificationMessage}
        type="success"
        onHide={hideNotification}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
});
```

## Usage

1. **Wrap your app** with `TimerProvider`
2. **Use the `useTimer` hook** in components that need timer functionality
3. **Customize break duration** using the `BreakDurationSelector`
4. **Display rewards** with the `RewardsDisplay` component
5. **Show notifications** with the `NotificationToast`

## Key Features

- ✅ **Persistent Storage**: Settings and points saved with AsyncStorage
- ✅ **Modular Design**: Easy to integrate into existing apps
- ✅ **Customizable**: Break duration can be adjusted from 1-60 minutes
- ✅ **Rewards System**: Points earned based on focus session duration
- ✅ **Notifications**: Toast notifications when points are earned
- ✅ **Achievements**: Unlockable achievements based on total points
- ✅ **Responsive UI**: Clean, modern interface with proper styling

This implementation provides a complete, production-ready timer system that you can easily integrate into your Defocus2Focus React Native app!
