import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocus } from '../contexts/FocusContext';

/**
 * CycleCounter Component - Displays completed focus cycles with positive reinforcement
 * Features: Cycle count, completion messages, visual feedback
 */
const CycleCounter = ({ 
  style = {},
  showMessage = true,
  compact = false 
}) => {
  const { 
    completedCyclesToday, 
    getCycleCompletionMessage,
    isFocusActive,
    isDefocusUsed 
  } = useFocus();

  // Get appropriate icon based on cycle count
  const getCycleIcon = () => {
    if (completedCyclesToday === 0) {
      return 'radio-button-off';
    } else if (completedCyclesToday < 3) {
      return 'checkmark-circle';
    } else {
      return 'trophy';
    }
  };

  // Get icon color based on cycle count
  const getIconColor = () => {
    if (completedCyclesToday === 0) {
      return '#9ca3af';
    } else if (completedCyclesToday < 3) {
      return '#10b981';
    } else {
      return '#f59e0b';
    }
  };

  // Get cycle status text
  const getCycleStatus = () => {
    if (isFocusActive) {
      return 'Focus in progress...';
    }
    if (isDefocusUsed) {
      return 'Ready to focus!';
    }
    if (completedCyclesToday === 0) {
      return 'Start your first cycle';
    }
    return `${completedCyclesToday} cycle${completedCyclesToday !== 1 ? 's' : ''} completed`;
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <Ionicons 
          name={getCycleIcon()} 
          size={16} 
          color={getIconColor()} 
        />
        <Text style={[styles.compactText, { color: getIconColor() }]}>
          {completedCyclesToday}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Cycle Count Display */}
      <View style={styles.cycleDisplay}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getCycleIcon()} 
            size={24} 
            color={getIconColor()} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.cycleCount}>
            {completedCyclesToday}
          </Text>
          <Text style={styles.cycleLabel}>
            Focus Cycle{completedCyclesToday !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Status Message */}
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { 
          color: isFocusActive ? '#3b82f6' : 
                 isDefocusUsed ? '#f59e0b' : 
                 completedCyclesToday > 0 ? '#10b981' : '#6b7280'
        }]}>
          {getCycleStatus()}
        </Text>
      </View>

      {/* Completion Message */}
      {showMessage && completedCyclesToday > 0 && (
        <View style={styles.messageContainer}>
          <Text style={styles.completionMessage}>
            {getCycleCompletionMessage()}
          </Text>
        </View>
      )}

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        {[1, 2, 3, 4, 5].map((cycle) => (
          <View
            key={cycle}
            style={[
              styles.progressDot,
              {
                backgroundColor: cycle <= completedCyclesToday 
                  ? getIconColor() 
                  : '#e5e7eb'
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cycleDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cycleCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 32,
  },
  cycleLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  completionMessage: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default CycleCounter;
