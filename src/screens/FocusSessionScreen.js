import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Vibration,
} from 'react-native';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';

/**
 * Focus Session Screen
 * Pomodoro-style timer with start, pause, resume, and stop functionality
 */
const FocusSessionScreen = () => {
  const { settings, addSession } = useUserData();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [interruptions, setInterruptions] = useState(0);
  
  // Timer interval reference
  const intervalRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((settings.focusDuration * 60 - timeLeft) / (settings.focusDuration * 60)) * 100;

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsPaused(false);
            
            // Vibrate to notify completion
            Vibration.vibrate([0, 500, 200, 500]);
            
            // Save completed session
            const sessionDuration = settings.focusDuration * 60 - prevTime;
            const sessionData = {
              id: Date.now(),
              type: 'focus',
              duration: sessionDuration,
              completed: true,
              interruptions,
              date: new Date().toISOString(),
            };
            addSession(sessionData);
            
            Alert.alert(
              'Focus Session Complete! 🎉',
              'Great job! You\'ve completed your focus session.',
              [{ text: 'OK' }]
            );
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, interruptions, settings.focusDuration, addSession]);

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setSessionStartTime(new Date());
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setInterruptions(prev => prev + 1);
    }
  };

  // Resume timer
  const resumeTimer = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
    }
  };

  // Stop timer
  const stopTimer = () => {
    if (isRunning || isPaused) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setIsPaused(false);
      
      // Save interrupted session if it was running for more than 1 minute
      if (sessionStartTime && timeLeft < settings.focusDuration * 60 - 60) {
        const sessionDuration = settings.focusDuration * 60 - timeLeft;
        const sessionData = {
          id: Date.now(),
          type: 'focus',
          duration: sessionDuration,
          completed: false,
          interruptions,
          date: new Date().toISOString(),
        };
        addSession(sessionData);
      }
      
      // Reset timer
      setTimeLeft(settings.focusDuration * 60);
      setInterruptions(0);
      setSessionStartTime(null);
    }
  };

  // Reset timer
  const resetTimer = () => {
    Alert.alert(
      'Reset Timer',
      'Are you sure you want to reset the timer? This will lose your current progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsPaused(false);
            setTimeLeft(settings.focusDuration * 60);
            setInterruptions(0);
            setSessionStartTime(null);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Timer Display */}
        <View style={styles.timerSection}>
          <ProgressRing
            progress={progress}
            size={280}
            strokeWidth={12}
            color="focus"
            showPercentage={false}
          >
            <View style={styles.timerContent}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>
                {isPaused ? 'Paused' : isRunning ? 'Focusing...' : 'Ready to Focus'}
              </Text>
            </View>
          </ProgressRing>
        </View>

        {/* Session Info */}
        <View style={styles.sessionInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Session Duration:</Text>
            <Text style={styles.infoValue}>{settings.focusDuration} minutes</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Interruptions:</Text>
            <Text style={styles.infoValue}>{interruptions}</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controls}>
          {!isRunning && !isPaused ? (
            // Start button
            <TouchableOpacity style={styles.startButton} onPress={startTimer}>
              <Text style={styles.startButtonText}>Start Focus Session</Text>
            </TouchableOpacity>
          ) : (
            // Running controls
            <View style={styles.runningControls}>
              {isPaused ? (
                <TouchableOpacity style={styles.resumeButton} onPress={resumeTimer}>
                  <Text style={styles.resumeButtonText}>Resume</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                  <Text style={styles.pauseButtonText}>Pause</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
                <Text style={styles.stopButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Reset button (always visible) */}
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Focus Tips</Text>
          <Text style={styles.tipsText}>
            • Find a quiet space{'\n'}
            • Put your phone on silent{'\n'}
            • Take deep breaths before starting{'\n'}
            • Stay hydrated during breaks
          </Text>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f3771e',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  sessionInfo: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  controls: {
    width: '100%',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#f3771e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  runningControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resumeButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resumeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  tipsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default FocusSessionScreen;
