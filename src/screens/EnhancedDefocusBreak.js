import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocus } from '../contexts/FocusContext';
import { useUserData } from '../contexts/UserDataContext';
import DefocusButton from '../components/DefocusButton';
import CycleCounter from '../components/CycleCounter';
import QuickResetModal from '../components/QuickResetModal';

/**
 * EnhancedDefocusBreak Screen - Implements the Defocus → Focus → Unlock cycle
 * Features: Session cycle logic, locked/unlocked states, positive reinforcement
 */
const EnhancedDefocusBreak = ({ onNavigate }) => {
  const {
    isDefocusAvailable,
    isDefocusLocked,
    isFocusActive,
    getDefocusLockMessage,
    getSessionStats,
    startDefocus,
    endDefocus,
  } = useFocus();

  const { addDefocusSession } = useUserData();
  
  const [showQuickReset, setShowQuickReset] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle defocus activity selection
  const handleDefocusActivity = (type, duration) => {
    if (!isDefocusAvailable()) {
      Alert.alert(
        '🔒 Defocus Locked',
        getDefocusLockMessage(),
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Start defocus session
    const success = startDefocus(type, duration);
    if (success) {
      // Navigate to the specific defocus activity
      switch (type) {
        case 'journaling':
          onNavigate('journaling');
          break;
        case 'game':
          onNavigate('game');
          break;
        case 'aiTherapist':
          onNavigate('aiTherapist');
          break;
        default:
          console.log('Unknown defocus type:', type);
      }
    }
  };

  // Handle quick reset
  const handleQuickReset = () => {
    setShowQuickReset(true);
  };

  // Get motivational message based on session state
  const getMotivationalMessage = () => {
    if (isFocusActive) {
      return {
        title: "🎯 Focus Session Active",
        message: "Keep up the great work! Defocus will unlock when you complete your session.",
        color: "#3b82f6"
      };
    }
    if (isDefocusLocked) {
      return {
        title: "✨ Ready to Focus",
        message: "You've used your defocus time. Complete a focus session to unlock it again!",
        color: "#f59e0b"
      };
    }
    return {
      title: "🌿 Defocus Time",
      message: "Take a mindful break to recharge and refocus.",
      color: "#10b981"
    };
  };

  const motivational = getMotivationalMessage();
  const sessionStats = getSessionStats();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.innerContent, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🌿 Defocus Time</Text>
            <Text style={styles.subtitle}>
              {isDefocusAvailable() ? 'Choose your mindful break' : 'Focus session required'}
            </Text>
          </View>

          {/* Cycle Counter */}
          <CycleCounter style={styles.cycleCounter} />

          {/* Motivational Message */}
          <View style={[styles.messageCard, { borderColor: motivational.color + '20' }]}>
            <View style={styles.messageHeader}>
              <Text style={[styles.messageTitle, { color: motivational.color }]}>
                {motivational.title}
              </Text>
              <Ionicons 
                name={isDefocusAvailable() ? "leaf" : "lock-closed"} 
                size={24} 
                color={motivational.color} 
              />
            </View>
            <Text style={styles.messageText}>
              {motivational.message}
            </Text>
          </View>

          {/* Defocus Activities */}
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>Mindful Activities</Text>
            
            <DefocusButton
              type="journaling"
              title="Journaling"
              icon="book"
              color="#8b5cf6"
              duration={10}
              onPress={() => handleDefocusActivity('journaling', 10)}
            />

            <DefocusButton
              type="game"
              title="Mini Game"
              icon="game-controller"
              color="#f59e0b"
              duration={5}
              onPress={() => handleDefocusActivity('game', 5)}
            />

            <DefocusButton
              type="aiTherapist"
              title="AI Therapist"
              icon="chatbubbles"
              color="#ef4444"
              duration={15}
              onPress={() => handleDefocusActivity('aiTherapist', 15)}
            />
          </View>

          {/* Quick Reset Section */}
          <View style={styles.quickResetSection}>
            <Text style={styles.sectionTitle}>Always Available</Text>
            
            <DefocusButton
              type="quickReset"
              title="Quick Reset"
              icon="leaf"
              color="#10b981"
              duration={1}
              onPress={handleQuickReset}
            />
            
            <Text style={styles.quickResetDescription}>
              A 1-minute breathing exercise that's always available, even when defocus is locked.
            </Text>
          </View>

          {/* Session Status */}
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Session Status</Text>
            
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <Ionicons 
                  name={isDefocusAvailable() ? "checkmark-circle" : "lock-closed"} 
                  size={20} 
                  color={isDefocusAvailable() ? "#10b981" : "#ef4444"} 
                />
                <Text style={styles.statusLabel}>Defocus</Text>
                <Text style={[styles.statusValue, { 
                  color: isDefocusAvailable() ? "#10b981" : "#ef4444" 
                }]}>
                  {isDefocusAvailable() ? "Available" : "Locked"}
                </Text>
              </View>

              <View style={styles.statusItem}>
                <Ionicons 
                  name={isFocusActive ? "play-circle" : "pause-circle"} 
                  size={20} 
                  color={isFocusActive ? "#3b82f6" : "#6b7280"} 
                />
                <Text style={styles.statusLabel}>Focus</Text>
                <Text style={[styles.statusValue, { 
                  color: isFocusActive ? "#3b82f6" : "#6b7280" 
                }]}>
                  {isFocusActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>💡 Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Use defocus time mindfully to recharge</Text>
              <Text style={styles.tip}>• Complete a focus session to unlock defocus again</Text>
              <Text style={styles.tip}>• Quick reset is always available for light breaks</Text>
              <Text style={styles.tip}>• Track your progress with the cycle counter</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Quick Reset Modal */}
      <QuickResetModal
        visible={showQuickReset}
        onClose={() => setShowQuickReset(false)}
      />
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
  },
  innerContent: {
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
  messageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  activitiesSection: {
    marginBottom: 24,
  },
  quickResetSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickResetDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  statusSection: {
    marginBottom: 24,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statusItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  tip: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default EnhancedDefocusBreak;
