import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Vibration,
  Modal,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';

/**
 * Enhanced Focus Session Screen
 * Pomodoro-style timer with task integration, session tracking, and advanced features
 */
const FocusSessionScreen = ({ navigation }) => {
  const { 
    userData, 
    addSession, 
    addFocusSessionToTask,
    updateSettings,
    getTasksByPriority,
    getTasksDueToday
  } = useUserData();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(userData.settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [interruptions, setInterruptions] = useState(0);
  const [currentSession, setCurrentSession] = useState(1);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(userData.settings.breakDuration * 60);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalFocusTime: 0,
    sessionsCompleted: 0,
    interruptions: 0,
    tasksCompleted: 0,
  });
  
  // Animation refs
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  
  // Timer interval reference
  const intervalRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = isBreak 
    ? ((userData.settings.breakDuration * 60 - breakTimeLeft) / (userData.settings.breakDuration * 60)) * 100
    : ((userData.settings.focusDuration * 60 - timeLeft) / (userData.settings.focusDuration * 60)) * 100;

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (isBreak) {
          setBreakTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              // Break completed
              clearInterval(intervalRef.current);
              setIsRunning(false);
              setIsPaused(false);
              setIsBreak(false);
              setBreakTimeLeft(userData.settings.breakDuration * 60);
              
              // Vibrate to notify completion
              if (userData.settings.vibrationEnabled) {
                Vibration.vibrate([0, 300, 100, 300]);
              }
              
              Alert.alert(
                'Break Complete! 🎉',
                'Ready to focus again?',
                [{ text: 'Start Focus Session', onPress: startTimer }]
              );
              
              return 0;
            }
            return prevTime - 1;
          });
        } else {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              // Focus session completed
              clearInterval(intervalRef.current);
              setIsRunning(false);
              setIsPaused(false);
              
              // Vibrate to notify completion
              if (userData.settings.vibrationEnabled) {
                Vibration.vibrate([0, 500, 200, 500]);
              }
              
              // Update session stats
              const sessionDuration = userData.settings.focusDuration * 60 - prevTime;
              setSessionStats(prev => ({
                ...prev,
                totalFocusTime: prev.totalFocusTime + sessionDuration,
                sessionsCompleted: prev.sessionsCompleted + 1,
                interruptions: prev.interruptions + interruptions,
              }));
              
              // Add focus session to selected task if any
              if (selectedTask) {
                addFocusSessionToTask(selectedTask.id, sessionDuration / 60);
              }
              
              // Save session data
              const sessionData = {
                type: 'focus',
                duration: sessionDuration,
                completed: true,
                interruptions,
                taskId: selectedTask?.id,
                notes: sessionNotes,
                date: new Date().toISOString(),
              };
              addSession(sessionData);
              
              setSessionsCompleted(prev => prev + 1);
              setShowSessionComplete(true);
              
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, interruptions, isBreak, selectedTask, sessionNotes, userData.settings]);

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setSessionStartTime(new Date());
      setIsRunning(true);
      setIsPaused(false);
      setInterruptions(0);
      
      // Start pulse animation
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
    }
  };

  // Pause timer
  const pauseTimer = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setInterruptions(prev => prev + 1);
      
      // Stop pulse animation
      pulseAnim.stopAnimation();
    }
  };

  // Resume timer
  const resumeTimer = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      
      // Resume pulse animation
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
    }
  };

  // Stop timer
  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setTimeLeft(userData.settings.focusDuration * 60);
    setBreakTimeLeft(userData.settings.breakDuration * 60);
    setSessionStartTime(null);
    setInterruptions(0);
    setIsBreak(false);
    setSessionNotes('');
    
    // Stop pulse animation
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  // Start break
  const startBreak = () => {
    setIsBreak(true);
    setBreakTimeLeft(userData.settings.breakDuration * 60);
    setIsRunning(true);
    setIsPaused(false);
    setSessionStartTime(new Date());
  };

  // Complete session and show summary
  const completeSession = () => {
    setShowSessionComplete(false);
    
    // Check if it's time for a long break
    const shouldTakeLongBreak = (sessionsCompleted + 1) % userData.settings.sessionsUntilLongBreak === 0;
    
    if (shouldTakeLongBreak) {
      Alert.alert(
        'Great job! 🎉',
        `You've completed ${sessionsCompleted + 1} sessions. Time for a longer break!`,
        [
          { text: 'Take Long Break', onPress: () => {
            setBreakTimeLeft(userData.settings.longBreakDuration * 60);
            startBreak();
          }},
          { text: 'Continue', onPress: () => {
            setTimeLeft(userData.settings.focusDuration * 60);
            setInterruptions(0);
          }}
        ]
      );
    } else {
      Alert.alert(
        'Session Complete! 🎉',
        'Would you like to take a short break?',
        [
          { text: 'Take Break', onPress: startBreak },
          { text: 'Continue', onPress: () => {
            setTimeLeft(userData.settings.focusDuration * 60);
            setInterruptions(0);
          }}
        ]
      );
    }
  };

  // Get suggested tasks
  const getSuggestedTasks = () => {
    const urgentTasks = getTasksByPriority('urgent');
    const todayTasks = getTasksDueToday();
    const highPriorityTasks = getTasksByPriority('high');
    
    return [...urgentTasks, ...todayTasks, ...highPriorityTasks].slice(0, 5);
  };

  const suggestedTasks = getSuggestedTasks();

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isBreak ? 'Break Time' : 'Focus Session'}
          </Text>
          <Text style={styles.subtitle}>
            {isBreak 
              ? 'Take a moment to relax and recharge'
              : `Session ${currentSession} • ${sessionsCompleted} completed`
            }
          </Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.progressContainer, { transform: [{ scale: pulseAnim }] }]}>
            <ProgressRing
              progress={progress}
              size={280}
              strokeWidth={12}
              color={isBreak ? '#10b981' : '#3b82f6'}
              backgroundColor="#f3f4f6"
            />
            <View style={styles.timerTextContainer}>
              <Text style={styles.timerText}>
                {isBreak ? formatTime(breakTimeLeft) : formatTime(timeLeft)}
              </Text>
              <Text style={styles.timerLabel}>
                {isBreak ? 'Break' : 'Focus'}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Selected Task */}
        {selectedTask && !isBreak && (
          <View style={styles.selectedTaskContainer}>
            <Text style={styles.selectedTaskLabel}>Working on:</Text>
            <View style={styles.selectedTaskCard}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.selectedTaskText}>{selectedTask.text}</Text>
            </View>
          </View>
        )}

        {/* Session Notes */}
        {isRunning && !isBreak && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Session Notes:</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes about your focus session..."
              value={sessionNotes}
              onChangeText={setSessionNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isRunning ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startTimer}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.startButtonGradient}
              >
                <Ionicons name="play" size={24} color="#ffffff" />
                <Text style={styles.startButtonText}>Start Focus Session</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.runningControls}>
              {isPaused ? (
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={resumeTimer}
                >
                  <Ionicons name="play" size={24} color="#10b981" />
                  <Text style={styles.controlButtonText}>Resume</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={pauseTimer}
                >
                  <Ionicons name="pause" size={24} color="#f59e0b" />
                  <Text style={styles.controlButtonText}>Pause</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={stopTimer}
              >
                <Ionicons name="stop" size={24} color="#ef4444" />
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Task Selection */}
        {!isRunning && !selectedTask && (
          <View style={styles.taskSelectionContainer}>
            <View style={styles.taskSelectionHeader}>
              <Text style={styles.taskSelectionTitle}>Suggested Tasks</Text>
              <TouchableOpacity
                style={styles.selectTaskButton}
                onPress={() => setShowTaskSelector(true)}
              >
                <Text style={styles.selectTaskButtonText}>Select Task</Text>
              </TouchableOpacity>
            </View>
            
            {suggestedTasks.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {suggestedTasks.map(task => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.suggestedTaskCard}
                    onPress={() => setSelectedTask(task)}
                  >
                    <Text style={styles.suggestedTaskText}>{task.text}</Text>
                    <Text style={styles.suggestedTaskPriority}>{task.priority}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noTasksText}>No tasks available. Add some tasks to get started!</Text>
            )}
          </View>
        )}

        {/* Session Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={20} color="#6b7280" />
            <Text style={styles.statValue}>{Math.floor(sessionStats.totalFocusTime / 60)}m</Text>
            <Text style={styles.statLabel}>Total Focus</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.statValue}>{sessionStats.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="pause-circle" size={20} color="#f59e0b" />
            <Text style={styles.statValue}>{sessionStats.interruptions}</Text>
            <Text style={styles.statLabel}>Pauses</Text>
          </View>
        </View>
      </Animated.View>

      {/* Task Selector Modal */}
      <Modal
        visible={showTaskSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTaskSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Task</Text>
              <TouchableOpacity onPress={() => setShowTaskSelector(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {userData.todoList.length === 0 ? (
                <View style={styles.emptyTasksState}>
                  <Ionicons name="list" size={48} color="#9ca3af" />
                  <Text style={styles.emptyTasksTitle}>No tasks available</Text>
                  <Text style={styles.emptyTasksText}>
                    Add some tasks to your TODO list to focus on them
                  </Text>
                </View>
              ) : (
                userData.todoList.map(task => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskOption}
                    onPress={() => {
                      setSelectedTask(task);
                      setShowTaskSelector(false);
                    }}
                  >
                    <View style={styles.taskOptionContent}>
                      <Text style={styles.taskOptionText}>{task.text}</Text>
                      {task.description && (
                        <Text style={styles.taskOptionDescription}>{task.description}</Text>
                      )}
                      <View style={styles.taskOptionMeta}>
                        <Text style={styles.taskOptionPriority}>{task.priority}</Text>
                        {task.estimatedTime && (
                          <Text style={styles.taskOptionTime}>{task.estimatedTime}m</Text>
                        )}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Session Complete Modal */}
      <Modal
        visible={showSessionComplete}
        animationType="fade"
        transparent={true}
        onRequestClose={completeSession}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sessionCompleteModal}>
            <View style={styles.sessionCompleteContent}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
              <Text style={styles.sessionCompleteTitle}>Session Complete!</Text>
              <Text style={styles.sessionCompleteText}>
                Great job! You've completed your focus session.
              </Text>
              
              <View style={styles.sessionCompleteStats}>
                <Text style={styles.sessionCompleteStat}>
                  Duration: {Math.floor((userData.settings.focusDuration * 60 - timeLeft) / 60)} minutes
                </Text>
                <Text style={styles.sessionCompleteStat}>
                  Interruptions: {interruptions}
                </Text>
                {selectedTask && (
                  <Text style={styles.sessionCompleteStat}>
                    Task: {selectedTask.text}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.sessionCompleteButton}
                onPress={completeSession}
              >
                <Text style={styles.sessionCompleteButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  timerLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  selectedTaskContainer: {
    marginBottom: 20,
  },
  selectedTaskLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  selectedTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    gap: 12,
  },
  selectedTaskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  controlsContainer: {
    marginBottom: 30,
  },
  startButton: {
    marginBottom: 16,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButtonText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  runningControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  taskSelectionContainer: {
    marginBottom: 30,
  },
  taskSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskSelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  selectTaskButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectTaskButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  suggestedTaskCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 200,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  suggestedTaskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  suggestedTaskPriority: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  noTasksText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalBody: {
    padding: 20,
  },
  emptyTasksState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTasksText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  taskOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskOptionContent: {
    flex: 1,
  },
  taskOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskOptionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  taskOptionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  taskOptionPriority: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  taskOptionTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  sessionCompleteModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sessionCompleteContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sessionCompleteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  sessionCompleteText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  sessionCompleteStats: {
    width: '100%',
    marginBottom: 24,
  },
  sessionCompleteStat: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  sessionCompleteButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sessionCompleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default FocusSessionScreen;
