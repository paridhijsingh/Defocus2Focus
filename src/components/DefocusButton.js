import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocus } from '../contexts/FocusContext';

/**
 * DefocusButton Component - Handles defocus activities with session cycle logic
 * Features: Lock/unlock states, tooltips, visual feedback, session integration
 */
const DefocusButton = ({
  type = 'journaling', // journaling, game, aiTherapist, quickReset
  title = 'Activity',
  icon = 'book',
  color = '#10b981',
  duration = 10, // minutes
  onPress = null,
  style = {},
  disabled = false,
}) => {
  const {
    isDefocusAvailable,
    isDefocusLocked,
    getDefocusLockMessage,
    startDefocus,
    startQuickReset,
    quickResetState,
  } = useFocus();

  const [scaleAnim] = useState(new Animated.Value(1));
  const [showTooltip, setShowTooltip] = useState(false);

  // Quick reset is always available
  const isQuickReset = type === 'quickReset';
  const isAvailable = isQuickReset || isDefocusAvailable();
  const isLocked = !isQuickReset && isDefocusLocked;

  // Handle button press
  const handlePress = () => {
    if (disabled) return;

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isLocked) {
      // Show lock message
      Alert.alert(
        '🔒 Defocus Locked',
        getDefocusLockMessage(),
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (isQuickReset) {
      // Start quick reset
      if (quickResetState.isActive) {
        Alert.alert(
          '🫁 Quick Reset Active',
          `Breathing exercise in progress (${quickResetState.remainingTime}s remaining)`,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      Alert.alert(
        '🫁 Quick Reset',
        'Start a 1-minute breathing exercise? This is always available and won\'t affect your focus cycle.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start', 
            style: 'default',
            onPress: () => {
              startQuickReset(60);
              if (onPress) onPress();
            }
          },
        ]
      );
      return;
    }

    // Start defocus session
    const success = startDefocus(type, duration);
    if (success) {
      if (onPress) onPress();
    } else {
      Alert.alert(
        '🔒 Defocus Unavailable',
        getDefocusLockMessage(),
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // Handle long press for tooltip
  const handleLongPress = () => {
    if (isLocked) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  // Get button styles based on state
  const getButtonStyles = () => {
    if (disabled) {
      return [styles.button, styles.disabledButton, style];
    }
    if (isLocked) {
      return [styles.button, styles.lockedButton, style];
    }
    if (isQuickReset && quickResetState.isActive) {
      return [styles.button, styles.activeButton, { backgroundColor: color + '20' }, style];
    }
    return [styles.button, styles.availableButton, { backgroundColor: color + '20' }, style];
  };

  // Get icon styles
  const getIconStyles = () => {
    if (disabled || isLocked) {
      return { color: '#9ca3af' };
    }
    if (isQuickReset && quickResetState.isActive) {
      return { color: color };
    }
    return { color: color };
  };

  // Get text styles
  const getTextStyles = () => {
    if (disabled || isLocked) {
      return [styles.buttonText, styles.disabledText];
    }
    return [styles.buttonText, { color: '#1f2937' }];
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={getButtonStyles()}
          onPress={handlePress}
          onLongPress={handleLongPress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons
                name={isLocked ? 'lock-closed' : icon}
                size={24}
                style={getIconStyles()}
              />
              {isLocked && (
                <View style={styles.lockOverlay}>
                  <Ionicons name="lock-closed" size={12} color="#ef4444" />
                </View>
              )}
            </View>

            {/* Title */}
            <Text style={getTextStyles()}>
              {title}
            </Text>

            {/* Duration or Status */}
            <Text style={[styles.durationText, isLocked && styles.disabledText]}>
              {isQuickReset && quickResetState.isActive 
                ? `${quickResetState.remainingTime}s`
                : isQuickReset 
                  ? '1 min'
                  : `${duration} min`
              }
            </Text>

            {/* Active indicator for quick reset */}
            {isQuickReset && quickResetState.isActive && (
              <View style={styles.activeIndicator}>
                <View style={[styles.pulseDot, { backgroundColor: color }]} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Tooltip for locked state */}
      {showTooltip && isLocked && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {getDefocusLockMessage()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  availableButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockedButton: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  disabledButton: {
    backgroundColor: 'rgba(156, 163, 175, 0.05)',
    borderColor: 'rgba(156, 163, 175, 0.2)',
  },
  activeButton: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  buttonContent: {
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  lockOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  disabledText: {
    color: '#9ca3af',
  },
  durationText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
  tooltip: {
    position: 'absolute',
    top: -60,
    left: -50,
    right: -50,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default DefocusButton;
