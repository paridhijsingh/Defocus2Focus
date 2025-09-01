import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Animated,
  Vibration,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';

/**
 * Enhanced Defocus Break Screen
 * Features:
 * - Time-boxed activities (default 10 minutes, customizable)
 * - Automatic lock after timer ends
 * - Motivational messages and transitions to focus
 * - Rewards only for proper defocus completion
 * - Abuse prevention through focus session requirements
 * - Lightweight mini-games (unlocked after focus sessions)
 * - Journaling and AI therapist with local storage
 */
const DefocusBreakScreen = ({ navigation }) => {
  const { 
    userData, 
    addDefocusSession, 
    canAccessDefocus, 
    getMotivationalMessage,
    addJournalEntry,
    addAITherapistData,
    updateSettings
  } = useUserData();

  // Timer state
  const [timeLeft, setTimeLeft] = useState(userData.settings.defocusTimeLimit * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);
  
  // UI state
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  // Form state
  const [journalEntry, setJournalEntry] = useState('');
  const [therapistMessage, setTherapistMessage] = useState('');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(userData.settings.defocusTimeLimit);
  
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

  // Check access on component mount
  useEffect(() => {
    if (!canAccessDefocus()) {
      setShowLockedModal(true);
    }
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((userData.settings.defocusTimeLimit * 60 - timeLeft) / (userData.settings.defocusTimeLimit * 60)) * 100;

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed - lock the screen
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsPaused(false);
            
            // Vibrate to notify completion
            if (userData.settings.vibrationEnabled) {
              Vibration.vibrate([0, 500, 200, 500]);
            }
            
            // Save defocus session
            const sessionDuration = userData.settings.defocusTimeLimit * 60 - prevTime;
            const sessionData = {
              type: 'defocus',
              duration: sessionDuration,
              activity: currentActivity,
              completed: true,
              date: new Date().toISOString(),
            };
            addDefocusSession(sessionData);
            
            // Show completion modal
            setShowCompleteModal(true);
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, currentActivity, userData.settings]);

  // Start defocus timer
  const startDefocusTimer = (activity) => {
    if (!canAccessDefocus()) {
      Alert.alert(
        'Access Restricted',
        'You need to complete a focus session first to access defocus activities.',
        [{ text: 'OK' }]
      );
      return;
    }

    setCurrentActivity(activity);
    setSessionStartTime(new Date());
    setIsRunning(true);
    setIsPaused(false);
    setTimeLeft(selectedTimeLimit * 60);
    
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
  };

  // Pause timer
  const pauseTimer = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      pulseAnim.stopAnimation();
    }
  };

  // Resume timer
  const resumeTimer = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
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

  // Stop timer early
  const stopTimer = () => {
    Alert.alert(
      'End Defocus Session?',
      'Are you sure you want to end your defocus session early? You won\'t receive rewards.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Session', 
          style: 'destructive',
          onPress: () => {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsPaused(false);
            setTimeLeft(selectedTimeLimit * 60);
            setSessionStartTime(null);
            setCurrentActivity(null);
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
          }
        }
      ]
    );
  };

  // Complete defocus session and transition to focus
  const completeDefocusSession = () => {
    setShowCompleteModal(false);
    
    const motivationalMessage = getMotivationalMessage();
    
    Alert.alert(
      'Break Complete! 🎉',
      'Great job taking a proper break! Ready to focus again?',
      [
        { 
          text: 'Start Focus Session', 
          onPress: () => navigation.navigate('FocusSession')
        },
        { 
          text: 'Continue Break', 
          onPress: () => {
            setTimeLeft(selectedTimeLimit * 60);
            setCurrentActivity(null);
          }
        }
      ]
    );
  };

  // Save journal entry
  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      addJournalEntry({
        content: journalEntry.trim(),
        mood: 'neutral', // Could be enhanced with mood selection
        tags: ['defocus', 'break'],
      });
      setJournalEntry('');
      setShowJournalModal(false);
      Alert.alert('Saved!', 'Your journal entry has been saved locally.');
    }
  };

  // Save AI therapist conversation
  const saveTherapistConversation = () => {
    if (therapistMessage.trim()) {
      addAITherapistData({
        userMessage: therapistMessage.trim(),
        aiResponse: generateAIResponse(therapistMessage.trim()),
        category: 'defocus_support',
      });
      setTherapistMessage('');
      setShowTherapistModal(false);
      Alert.alert('Conversation Saved!', 'Your conversation has been saved locally.');
    }
  };

  // Simple AI response generator (placeholder)
  const generateAIResponse = (message) => {
    const responses = [
      "That's a great insight! How does that make you feel?",
      "I understand. Taking breaks is important for productivity.",
      "It sounds like you're being mindful about your work-life balance.",
      "Remember, it's okay to take time for yourself.",
      "What would help you feel more refreshed right now?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Defocus activities
  const defocusActivities = [
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Take a mindful moment to breathe and center yourself',
      icon: 'leaf',
      color: '#10b981',
      timeRequired: 5,
    },
    {
      id: 'stretching',
      title: 'Stretching',
      description: 'Gentle stretches to release tension and improve circulation',
      icon: 'fitness',
      color: '#3b82f6',
      timeRequired: 3,
    },
    {
      id: 'journaling',
      title: 'Journaling',
      description: 'Reflect on your thoughts and feelings',
      icon: 'book',
      color: '#8b5cf6',
      timeRequired: 5,
    },
    {
      id: 'ai_therapist',
      title: 'AI Therapist',
      description: 'Have a supportive conversation about your day',
      icon: 'chatbubbles',
      color: '#f59e0b',
      timeRequired: 7,
    },
    {
      id: 'mini_game',
      title: 'Mini Game',
      description: 'Play a quick brain teaser or puzzle',
      icon: 'game-controller',
      color: '#ef4444',
      timeRequired: 5,
      requiresFocusSession: true, // Only unlock after focus session
    },
    {
      id: 'music',
      title: 'Music Break',
      description: 'Listen to calming music or your favorite tunes',
      icon: 'musical-notes',
      color: '#ec4899',
      timeRequired: 5,
    },
  ];

  const motivationalMessage = getMotivationalMessage();

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Defocus Break</Text>
          <Text style={styles.subtitle}>
            Take a mindful break to recharge and refresh
          </Text>
        </View>

        {/* Motivational Message */}
        <View style={[styles.motivationalCard, styles[`motivational${motivationalMessage.type}`]]}>
          <Ionicons 
            name={motivationalMessage.type === 'warning' ? 'alert-circle' : 
                  motivationalMessage.type === 'urgent' ? 'warning' : 
                  motivationalMessage.type === 'info' ? 'information-circle' : 'checkmark-circle'} 
            size={24} 
            color={motivationalMessage.type === 'warning' ? '#f59e0b' : 
                   motivationalMessage.type === 'urgent' ? '#ef4444' : 
                   motivationalMessage.type === 'info' ? '#3b82f6' : '#10b981'} 
          />
          <View style={styles.motivationalContent}>
            <Text style={styles.motivationalTitle}>{motivationalMessage.title}</Text>
            <Text style={styles.motivationalText}>{motivationalMessage.message}</Text>
          </View>
        </View>

        {/* Timer Display (when active) */}
        {isRunning && (
          <View style={styles.timerContainer}>
            <Animated.View style={[styles.progressContainer, { transform: [{ scale: pulseAnim }] }]}>
              <ProgressRing
                progress={progress}
                size={200}
                strokeWidth={8}
                color="#10b981"
                backgroundColor="#f3f4f6"
              />
              <View style={styles.timerTextContainer}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.timerLabel}>Break Time</Text>
              </View>
            </Animated.View>
            
            {currentActivity && (
              <View style={styles.currentActivityCard}>
                <Ionicons name={defocusActivities.find(a => a.id === currentActivity)?.icon} size={20} color="#10b981" />
                <Text style={styles.currentActivityText}>
                  {defocusActivities.find(a => a.id === currentActivity)?.title}
                </Text>
              </View>
            )}
            
            <View style={styles.timerControls}>
              {isPaused ? (
                <TouchableOpacity style={styles.controlButton} onPress={resumeTimer}>
                  <Ionicons name="play" size={20} color="#10b981" />
                  <Text style={styles.controlButtonText}>Resume</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.controlButton} onPress={pauseTimer}>
                  <Ionicons name="pause" size={20} color="#f59e0b" />
                  <Text style={styles.controlButtonText}>Pause</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.controlButton} onPress={stopTimer}>
                <Ionicons name="stop" size={20} color="#ef4444" />
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Time Limit Selector */}
        {!isRunning && (
          <View style={styles.timeLimitContainer}>
            <Text style={styles.timeLimitTitle}>Break Duration</Text>
            <View style={styles.timeLimitOptions}>
              {[5, 10, 15, 20].map(minutes => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.timeLimitOption,
                    selectedTimeLimit === minutes && styles.selectedTimeLimitOption
                  ]}
                  onPress={() => setSelectedTimeLimit(minutes)}
                >
                  <Text style={[
                    styles.timeLimitOptionText,
                    selectedTimeLimit === minutes && styles.selectedTimeLimitOptionText
                  ]}>
                    {minutes}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Activities Grid */}
        {!isRunning && (
          <View style={styles.activitiesContainer}>
            <Text style={styles.activitiesTitle}>Choose Your Break Activity</Text>
            <View style={styles.activitiesGrid}>
              {defocusActivities.map(activity => {
                const isLocked = activity.requiresFocusSession && !userData.games.unlocked;
                
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={[
                      styles.activityCard,
                      isLocked && styles.lockedActivityCard
                    ]}
                    onPress={() => {
                      if (isLocked) {
                        Alert.alert(
                          'Activity Locked',
                          'Complete a focus session first to unlock this activity.',
                          [{ text: 'OK' }]
                        );
                      } else if (activity.id === 'journaling') {
                        setShowJournalModal(true);
                      } else if (activity.id === 'ai_therapist') {
                        setShowTherapistModal(true);
                      } else if (activity.id === 'mini_game') {
                        setShowGameModal(true);
                      } else {
                        startDefocusTimer(activity.id);
                      }
                    }}
                    disabled={isLocked}
                  >
                    <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                      <Ionicons 
                        name={activity.icon} 
                        size={24} 
                        color={isLocked ? '#9ca3af' : activity.color} 
                      />
                      {isLocked && (
                        <View style={styles.lockOverlay}>
                          <Ionicons name="lock-closed" size={12} color="#9ca3af" />
                        </View>
                      )}
                    </View>
                    <Text style={[
                      styles.activityTitle,
                      isLocked && styles.lockedActivityTitle
                    ]}>
                      {activity.title}
                    </Text>
                    <Text style={[
                      styles.activityDescription,
                      isLocked && styles.lockedActivityDescription
                    ]}>
                      {activity.description}
                    </Text>
                    <Text style={styles.activityTime}>{activity.timeRequired}m</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Break Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={20} color="#6b7280" />
            <Text style={styles.statValue}>
              {Math.floor(userData.defocusAbusePrevention.defocusTimeUsed / 60)}m
            </Text>
            <Text style={styles.statLabel}>Today's Breaks</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.statValue}>{userData.defocusSessions.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={20} color="#f59e0b" />
            <Text style={styles.statValue}>{userData.coins}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
        </View>
      </Animated.View>

      {/* Locked Access Modal */}
      <Modal
        visible={showLockedModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.lockedModal}>
            <Ionicons name="lock-closed" size={64} color="#ef4444" />
            <Text style={styles.lockedModalTitle}>Access Restricted</Text>
            <Text style={styles.lockedModalText}>
              You need to complete a focus session first to access defocus activities. 
              This helps maintain a healthy balance between work and breaks.
            </Text>
            <TouchableOpacity
              style={styles.lockedModalButton}
              onPress={() => {
                setShowLockedModal(false);
                navigation.navigate('FocusSession');
              }}
            >
              <Text style={styles.lockedModalButtonText}>Start Focus Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Journal Modal */}
      <Modal
        visible={showJournalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowJournalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Journal Your Thoughts</Text>
              <TouchableOpacity onPress={() => setShowJournalModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TextInput
                style={styles.journalInput}
                placeholder="How are you feeling? What's on your mind?"
                value={journalEntry}
                onChangeText={setJournalEntry}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowJournalModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={saveJournalEntry}
                disabled={!journalEntry.trim()}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  Save Entry
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Therapist Modal */}
      <Modal
        visible={showTherapistModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTherapistModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Therapist</Text>
              <TouchableOpacity onPress={() => setShowTherapistModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.therapistPrompt}>
                How are you feeling today? What would you like to talk about?
              </Text>
              <TextInput
                style={styles.therapistInput}
                placeholder="Share your thoughts..."
                value={therapistMessage}
                onChangeText={setTherapistMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowTherapistModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={saveTherapistConversation}
                disabled={!therapistMessage.trim()}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  Save Conversation
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mini Game Modal */}
      <Modal
        visible={showGameModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mini Game</Text>
              <TouchableOpacity onPress={() => setShowGameModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.gamePlaceholder}>
                <Ionicons name="game-controller" size={48} color="#9ca3af" />
                <Text style={styles.gamePlaceholderTitle}>Game Coming Soon!</Text>
                <Text style={styles.gamePlaceholderText}>
                  Lightweight mini-games will be available here to help you relax and refresh.
                </Text>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={() => setShowGameModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  Got it!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Session Complete Modal */}
      <Modal
        visible={showCompleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={completeDefocusSession}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sessionCompleteModal}>
            <View style={styles.sessionCompleteContent}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
              <Text style={styles.sessionCompleteTitle}>Break Complete!</Text>
              <Text style={styles.sessionCompleteText}>
                Great job taking a proper break! You've earned some rewards for maintaining balance.
              </Text>
              
              <View style={styles.sessionCompleteStats}>
                <Text style={styles.sessionCompleteStat}>
                  Duration: {selectedTimeLimit} minutes
                </Text>
                <Text style={styles.sessionCompleteStat}>
                  Activity: {defocusActivities.find(a => a.id === currentActivity)?.title}
                </Text>
                <Text style={styles.sessionCompleteStat}>
                  Rewards: +{Math.floor(selectedTimeLimit / 2)} points, +{Math.floor(selectedTimeLimit / 5)} coins
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.sessionCompleteButton}
                onPress={completeDefocusSession}
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
    marginBottom: 20,
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
  motivationalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  motivationalwarning: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  motivationalurgent: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  motivationalinfo: {
    backgroundColor: '#dbeafe',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  motivationalsuccess: {
    backgroundColor: '#d1fae5',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  motivationalContent: {
    flex: 1,
  },
  motivationalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  motivationalText: {
    fontSize: 14,
    color: '#374151',
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  timerLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  currentActivityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  currentActivityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  timeLimitContainer: {
    marginBottom: 30,
  },
  timeLimitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  timeLimitOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  timeLimitOption: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedTimeLimitOption: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  timeLimitOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedTimeLimitOptionText: {
    color: '#ffffff',
  },
  activitiesContainer: {
    flex: 1,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  lockedActivityCard: {
    opacity: 0.6,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 2,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  lockedActivityTitle: {
    color: '#9ca3af',
  },
  activityDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedActivityDescription: {
    color: '#9ca3af',
  },
  activityTime: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
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
    fontSize: 18,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockedModal: {
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
  lockedModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 12,
  },
  lockedModalText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  lockedModalButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  lockedModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    maxHeight: '80%',
    width: '100%',
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
  journalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  therapistPrompt: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 24,
  },
  therapistInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  gamePlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  gamePlaceholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  gamePlaceholderText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  sessionCompleteModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default DefocusBreakScreen;
