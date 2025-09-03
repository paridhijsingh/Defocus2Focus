import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  BackHandler 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing 
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import ActionButton from '../components/ActionButton';

const durationOptions = [5, 10, 15, 20, 25, 30]; // minutes

export default function DefocusLockScreen() {
  const { state, actions } = useApp();
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  // Animation values
  const breathingScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    // Prevent back button on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      backHandler.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    // Update progress animation
    const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;
    progressValue.value = withTiming(progress, { duration: 1000 });
  }, [timeLeft, selectedDuration]);

  const handleBackPress = () => {
    if (isRunning && !isCompleted) {
      Alert.alert(
        'Exit Defocus Session?',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Exit', 
            style: 'destructive',
            onPress: () => {
              actions.setDefocusLock(false);
              actions.setCurrentScreen('MainTabs');
            }
          },
        ]
      );
      return true;
    }
    return false;
  };

  const startSession = () => {
    setIsRunning(true);
    setTimeLeft(selectedDuration * 60);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Start breathing animation
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Start pulse animation
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );
  };

  const pauseSession = () => {
    setIsRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Stop animations
    breathingScale.value = withTiming(1, { duration: 500 });
    pulseOpacity.value = withTiming(0.5, { duration: 500 });
  };

  const handleComplete = () => {
    setIsRunning(false);
    setIsCompleted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Stop animations
    breathingScale.value = withTiming(1, { duration: 500 });
    pulseOpacity.value = withTiming(1, { duration: 500 });
    
    // Complete the session
    actions.completeDefocusSession(selectedDuration);
  };

  const finishSession = () => {
    actions.setDefocusLock(false);
    actions.setCurrentScreen('MainTabs');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const breathingAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: breathingScale.value }],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });

  if (isCompleted) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <LinearGradient
          colors={['#10b981', '#059669']}
          className="flex-1 justify-center items-center px-8"
        >
          <View className="items-center">
            <Text className="text-8xl mb-6">🎉</Text>
            <Text className="text-3xl font-bold text-white mb-4 text-center">
              Defocus Complete!
            </Text>
            <Text className="text-green-100 text-lg text-center mb-8">
              Great job! You've completed a {selectedDuration}-minute defocus session.
            </Text>
            
            <View className="bg-white/20 rounded-xl p-6 mb-8 w-full">
              <Text className="text-white font-semibold text-lg mb-4 text-center">
                Session Rewards
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl mb-1">⚡</Text>
                  <Text className="text-white font-bold text-xl">
                    +{Math.floor(selectedDuration / 5) * 10}
                  </Text>
                  <Text className="text-green-100 text-sm">XP</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl mb-1">🪙</Text>
                  <Text className="text-white font-bold text-xl">
                    +{Math.floor(selectedDuration / 10) * 5}
                  </Text>
                  <Text className="text-green-100 text-sm">Coins</Text>
                </View>
              </View>
            </View>
            
            <ActionButton
              title="Continue"
              onPress={finishSession}
              gradient
              gradientColors={['#ffffff', '#f3f4f6']}
              size="lg"
              className="w-full"
            />
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="flex-1 justify-center items-center px-8"
      >
        {/* Header */}
        <View className="absolute top-12 left-6 right-6 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={handleBackPress}
            className="bg-white/20 rounded-full p-2"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-lg">
            Defocus Session
          </Text>
          <View className="w-10" />
        </View>

        <View className="items-center w-full">
          {/* Breathing Circle */}
          <Animated.View style={breathingAnimatedStyle} className="mb-8">
            <Animated.View style={pulseAnimatedStyle}>
              <View className="w-64 h-64 bg-white/20 rounded-full items-center justify-center">
                <View className="w-48 h-48 bg-white/30 rounded-full items-center justify-center">
                  <View className="w-32 h-32 bg-white/40 rounded-full items-center justify-center">
                    <Text className="text-4xl font-bold text-white">
                      {formatTime(timeLeft)}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Progress Bar */}
          <View className="w-full bg-white/20 rounded-full h-2 mb-8">
            <Animated.View 
              style={progressAnimatedStyle}
              className="bg-white h-2 rounded-full"
            />
          </View>

          {/* Status Text */}
          <Text className="text-white text-xl font-semibold mb-2 text-center">
            {isRunning ? 'Stay Focused' : 'Ready to Begin?'}
          </Text>
          <Text className="text-blue-100 text-center mb-8">
            {isRunning 
              ? 'Take deep breaths and focus on your task'
              : 'Select duration and start your defocus session'
            }
          </Text>

          {/* Duration Selection (only when not running) */}
          {!isRunning && (
            <View className="w-full mb-8">
              <Text className="text-white font-semibold mb-4 text-center">
                Select Duration
              </Text>
              <View className="flex-row flex-wrap justify-center">
                {durationOptions.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => setSelectedDuration(duration)}
                    className={`mx-2 mb-2 px-4 py-2 rounded-full ${
                      selectedDuration === duration
                        ? 'bg-white'
                        : 'bg-white/20'
                    }`}
                  >
                    <Text className={`font-semibold ${
                      selectedDuration === duration
                        ? 'text-blue-600'
                        : 'text-white'
                    }`}>
                      {duration}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="w-full">
            {!isRunning ? (
              <ActionButton
                title="Start Defocus Session"
                onPress={startSession}
                gradient
                gradientColors={['#10b981', '#059669']}
                size="lg"
                icon="▶️"
                className="w-full"
              />
            ) : (
              <ActionButton
                title="Pause Session"
                onPress={pauseSession}
                gradient
                gradientColors={['#f59e0b', '#d97706']}
                size="lg"
                icon="⏸️"
                className="w-full"
              />
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
