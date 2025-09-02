import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocus } from '../contexts/FocusContext';
import { useUserData } from '../contexts/UserDataContext';
import CycleCounter from '../components/CycleCounter';

/**
 * EnhancedFocusSession Screen - Integrates with session cycle logic
 * Features: Session cycle integration, completion rewards, state management
 */
const EnhancedFocusSession = ({ onNavigate }) => {
  const {
    isFocusActive,
    isDefocusUsed,
    startFocus,
    endFocus,
    getCycleCompletionMessage,
    getSessionStats,
  } = useFocus();

  const { addSession } = useUserData();
  
  const [sessionTime, setSessionTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(sessionTime);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(time => time - 1);
      }, 1000);
    } else if (currentTime === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start focus session
  const handleStartSession = () => {
    if (isFocusActive) {
      Alert.alert(
        '🎯 Session Active',
        'A focus session is already running.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const focusSession = startFocus({
      duration: sessionTime / 60, // Convert to minutes
      type: 'pomodoro',
    });

    setIsRunning(true);
    console.log('🎯 Focus session started:', focusSession);
  };

  // Pause/Resume session
  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  // Stop session
  const handleStopSession = () => {
    Alert.alert(
      '⏹️ Stop Session',
      'Are you sure you want to stop the current session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Stop', 
          style: 'destructive',
          onPress: () => {
            setIsRunning(false);
            setCurrentTime(sessionTime);
            endFocus();
          }
        },
      ]
    );
  };

  // Complete session
  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // End focus session and get completion data
    const completionData = endFocus({
      duration: sessionTime / 60,
      completed: true,
    });

    // Add session to user data
    addSession({
      duration: sessionTime / 60,
      type: 'pomodoro',
      completed: true,
    });

    // Show completion message
    const message = completionData.cycleCompleted 
      ? `${getCycleCompletionMessage()}\n\nYou've completed ${completionData.totalCyclesToday} focus cycle${completionData.totalCyclesToday !== 1 ? 's' : ''} today!`
      : '🎉 Great job completing your focus session!';

    Alert.alert(
      '🎉 Session Complete!',
      message,
      [
        { 
          text: 'Continue', 
          style: 'default',
          onPress: () => {
            setCurrentTime(sessionTime);
            onNavigate('dashboard');
          }
        },
      ]
    );
  };

  // Reset session
  const handleResetSession = () => {
    setIsRunning(false);
    setCurrentTime(sessionTime);
  };

  // Get progress percentage
  const getProgress = () => {
    return ((sessionTime - currentTime) / sessionTime) * 100;
  };

  // Get session status message
  const getSessionStatus = () => {
    if (isFocusActive && isRunning) {
      return "🎯 Focus session in progress...";
    }
    if (isFocusActive && !isRunning) {
      return "⏸️ Focus session paused";
    }
    if (isDefocusUsed) {
      return "✨ Ready to focus! Your defocus time has been used.";
    }
    return "🌿 Take a defocus break first, then start your focus session.";
  };

  const sessionStats = getSessionStats();
  const progress = getProgress();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎯 Focus Session</Text>
          <Text style={styles.subtitle}>
            {isFocusActive ? 'Deep work time' : 'Start your focus session'}
          </Text>
        </View>

        {/* Cycle Counter */}
        <CycleCounter style={styles.cycleCounter} />

        {/* Session Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>
            {getSessionStatus()}
          </Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>
              {formatTime(currentTime)}
            </Text>
            <Text style={styles.timerLabel}>
              {isRunning ? 'Focusing...' : 'Ready'}
            </Text>
          </View>
          
          {/* Progress Ring */}
          <View style={styles.progressRing}>
            <View 
              style={[
                styles.progressFill,
                { 
                  transform: [{ rotate: `${(progress / 100) * 360}deg` }],
                  backgroundColor: progress > 0 ? '#10b981' : '#e5e7eb'
                }
              ]} 
            />
          </View>
        </View>

        {/* Session Controls */}
        <View style={styles.controlsContainer}>
          {!isFocusActive ? (
            <TouchableOpacity
              style={[styles.controlButton, styles.startButton]}
              onPress={handleStartSession}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.buttonGradient}
              >
                <Ionicons name="play" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Start Focus</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity
                style={[styles.controlButton, styles.pauseButton]}
                onPress={handlePauseResume}
              >
                <Ionicons 
                  name={isRunning ? "pause" : "play"} 
                  size={20} 
                  color="#f59e0b" 
                />
                <Text style={[styles.buttonText, { color: '#f59e0b' }]}>
                  {isRunning ? 'Pause' : 'Resume'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={handleStopSession}
              >
                <Ionicons name="stop" size={20} color="#ef4444" />
                <Text style={[styles.buttonText, { color: '#ef4444' }]}>
                  Stop
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={handleResetSession}
            disabled={isRunning}
          >
            <Ionicons name="refresh" size={20} color="#6b7280" />
            <Text style={[styles.buttonText, { color: '#6b7280' }]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        {/* Session Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              Session: {sessionTime / 60} minutes
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              Progress: {Math.round(progress)}%
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Focus Tips</Text>
          <Text style={styles.tip}>• Put your phone in another room</Text>
          <Text style={styles.tip}>• Use noise-canceling headphones</Text>
          <Text style={styles.tip}>• Close unnecessary browser tabs</Text>
          <Text style={styles.tip}>• Set a clear goal for this session</Text>
        </View>
      </Animated.View>
    </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  cycleCounter: {
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: '#f3f4f6',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  progressRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: '#e5e7eb',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  progressFill: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#10b981',
    borderRightColor: '#10b981',
  },
  controlsContainer: {
    marginBottom: 24,
  },
  controlButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  activeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default EnhancedFocusSession;
