import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';

const { width, height } = Dimensions.get('window');

const PomodoroScreen = ({ navigation }) => {
  const { userData, addFocusTime, addCoins, addPoints, setCurrentTask } = useUserData();
  const [timeRemaining, setTimeRemaining] = useState(userData.pomodoroLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionType, setSessionType] = useState('focus'); // 'focus' or 'break'

  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  const handleSessionComplete = () => {
    if (sessionType === 'focus') {
      addFocusTime(userData.pomodoroLength);
      addPoints(25);
      addCoins(15);
      setCompletedSessions(prev => prev + 1);
      
      // Move to next task if available
      if (userData.todoList.length > 0 && currentTaskIndex < userData.todoList.length - 1) {
        setCurrentTaskIndex(prev => prev + 1);
      }

      Alert.alert(
        'Focus Session Complete! 🎉',
        'Great job! Time for a break.',
        [
          {
            text: 'Take Break',
            onPress: () => startBreak(),
          },
          {
            text: 'Continue Working',
            onPress: () => startFocusSession(),
          },
        ]
      );
    } else {
      Alert.alert(
        'Break Complete!',
        'Ready to focus again?',
        [
          {
            text: 'Start Focus',
            onPress: () => startFocusSession(),
          },
          {
            text: 'Take Another Break',
            onPress: () => startBreak(),
          },
        ]
      );
    }
  };

  const startFocusSession = () => {
    setSessionType('focus');
    setTimeRemaining(userData.pomodoroLength * 60);
    setIsBreak(false);
    setIsActive(true);
  };

  const startBreak = () => {
    setSessionType('break');
    setTimeRemaining(userData.breakLength * 60);
    setIsBreak(true);
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (sessionType === 'focus') {
      setTimeRemaining(userData.pomodoroLength * 60);
    } else {
      setTimeRemaining(userData.breakLength * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTask = () => {
    if (userData.todoList.length === 0) return null;
    return userData.todoList[currentTaskIndex];
  };

  const completeCurrentTask = () => {
    if (userData.todoList.length > 0) {
      const task = userData.todoList[currentTaskIndex];
      // This would need to be implemented in the context
      Alert.alert('Task Completed!', `Great job completing: ${task.text}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Timer Display */}
        <View style={styles.timerSection}>
          <LinearGradient
            colors={isBreak ? ['#10b981', '#059669'] : ['#6366f1', '#4f46e5']}
            style={styles.timerContainer}
          >
            <Text style={styles.sessionType}>
              {isBreak ? 'Break Time' : 'Focus Session'}
            </Text>
            
            <Animated.View style={[styles.timerDisplay, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </Animated.View>

            <View style={styles.timerControls}>
              {!isActive ? (
                <TouchableOpacity style={styles.startButton} onPress={startFocusSession}>
                  <Ionicons name="play" size={24} color="#ffffff" />
                  <Text style={styles.startButtonText}>Start Focus</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                  <Ionicons name="pause" size={24} color="#ffffff" />
                  <Text style={styles.pauseButtonText}>Pause</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                <Ionicons name="refresh" size={20} color="#ffffff" />
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Current Task */}
        <View style={styles.taskSection}>
          <Text style={styles.sectionTitle}>Current Task</Text>
          {getCurrentTask() ? (
            <View style={styles.currentTaskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskText}>{getCurrentTask().text}</Text>
                <Text style={styles.taskProgress}>
                  Task {currentTaskIndex + 1} of {userData.todoList.length}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.completeTaskButton}
                onPress={completeCurrentTask}
              >
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noTaskCard}>
              <Ionicons name="list" size={48} color="#9ca3af" />
              <Text style={styles.noTaskText}>No tasks available</Text>
              <Text style={styles.noTaskSubtext}>
                Add tasks in the Todo screen to get started
              </Text>
            </View>
          )}
        </View>

        {/* Session Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Session Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="timer" size={24} color="#6366f1" />
              <Text style={styles.statValue}>{completedSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#10b981" />
              <Text style={styles.statValue}>{Math.floor(userData.totalFocusTime / 60)}h</Text>
              <Text style={styles.statLabel}>Total Focus</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{userData.points}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.breakButton]}
              onPress={startBreak}
            >
              <Ionicons name="leaf" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Take Break</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.musicButton]}
              onPress={() => navigation.navigate('Music')}
            >
              <Ionicons name="musical-notes" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Music</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Break')}
          >
            <Text style={styles.navButtonText}>Break Activities</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  timerSection: {
    marginBottom: 30,
  },
  timerContainer: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  sessionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  timerDisplay: {
    marginBottom: 30,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  pauseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 5,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  taskSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  currentTaskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskProgress: {
    fontSize: 14,
    color: '#6b7280',
  },
  completeTaskButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTaskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noTaskText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  noTaskSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  breakButton: {
    backgroundColor: '#10b981',
  },
  musicButton: {
    backgroundColor: '#8b5cf6',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navigationSection: {
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PomodoroScreen;
