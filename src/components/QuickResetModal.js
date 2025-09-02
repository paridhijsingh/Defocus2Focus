import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocus } from '../contexts/FocusContext';

const { width, height } = Dimensions.get('window');

/**
 * QuickResetModal Component - Breathing exercise modal
 * Features: Animated breathing guide, timer, calming visuals
 */
const QuickResetModal = ({ visible, onClose }) => {
  const { quickResetState, endQuickReset } = useFocus();
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale
  const [breathCount, setBreathCount] = useState(0);
  
  // Animation values
  const [scaleAnim] = useState(new Animated.Value(1));
  const [opacityAnim] = useState(new Animated.Value(0.3));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Breathing cycle timing (seconds)
  const BREATHING_CYCLE = {
    inhale: 4,
    hold: 2,
    exhale: 6,
  };

  useEffect(() => {
    if (visible && quickResetState.isActive) {
      startBreathingAnimation();
    } else {
      resetAnimations();
    }
  }, [visible, quickResetState.isActive]);

  const startBreathingAnimation = () => {
    const cycle = () => {
      // Inhale phase
      setBreathPhase('inhale');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: BREATHING_CYCLE.inhale * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: BREATHING_CYCLE.inhale * 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold phase
        setBreathPhase('hold');
        setTimeout(() => {
          // Exhale phase
          setBreathPhase('exhale');
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: BREATHING_CYCLE.exhale * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: BREATHING_CYCLE.exhale * 1000,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setBreathCount(prev => prev + 1);
            if (quickResetState.isActive) {
              cycle();
            }
          });
        }, BREATHING_CYCLE.hold * 1000);
      });
    };

    cycle();
  };

  const resetAnimations = () => {
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.3);
    setBreathPhase('inhale');
    setBreathCount(0);
  };

  const handleClose = () => {
    endQuickReset();
    onClose();
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out gently...';
      default:
        return 'Breathe naturally...';
    }
  };

  const getBreathColor = () => {
    switch (breathPhase) {
      case 'inhale':
        return '#3b82f6';
      case 'hold':
        return '#8b5cf6';
      case 'exhale':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🫁 Quick Reset</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>
              {Math.floor(quickResetState.remainingTime / 60)}:
              {(quickResetState.remainingTime % 60).toString().padStart(2, '0')}
            </Text>
            <Text style={styles.timerLabel}>remaining</Text>
          </View>

          {/* Breathing Circle */}
          <View style={styles.breathingContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                  backgroundColor: getBreathColor() + '20',
                  borderColor: getBreathColor(),
                },
              ]}
            >
              <View style={[styles.innerCircle, { backgroundColor: getBreathColor() + '40' }]}>
                <Ionicons 
                  name="leaf" 
                  size={32} 
                  color={getBreathColor()} 
                />
              </View>
            </Animated.View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={[styles.instruction, { color: getBreathColor() }]}>
              {getBreathInstruction()}
            </Text>
            <Text style={styles.breathCount}>
              Breath {breathCount + 1}
            </Text>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <Text style={styles.tip}>• Find a comfortable position</Text>
            <Text style={styles.tip}>• Close your eyes if it helps</Text>
            <Text style={styles.tip}>• Focus on the rhythm</Text>
            <Text style={styles.tip}>• Let go of tension</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.finishButton]}
              onPress={handleClose}
            >
              <Ionicons name="checkmark" size={20} color="#ffffff" />
              <Text style={styles.finishButtonText}>Finish Early</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.8,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  breathingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  instruction: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  breathCount: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  finishButton: {
    backgroundColor: '#10b981',
  },
  finishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickResetModal;
