import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import ActionButton from '../components/ActionButton';
import ProgressCircle from '../components/ProgressCircle';

const focusDurations = [15, 25, 45, 60]; // minutes
const breakDurations = [5, 10, 15, 20]; // minutes

export default function FocusScreen() {
  const { state, actions } = useApp();
  const navigation = useNavigation();
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
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

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      // Focus session completed
      setSessionCount(sessionCount + 1);
      setIsBreak(true);
      setTimeLeft(breakTime * 60);
      
      // Award XP and coins for focus session
      const xpEarned = Math.floor(focusTime / 5) * 15; // 15 XP per 5 minutes
      const coinsEarned = Math.floor(focusTime / 10) * 8; // 8 coins per 10 minutes
      
      actions.updateStats({
        xp: state.stats.xp + xpEarned,
        coins: state.stats.coins + coinsEarned,
        totalSessions: state.stats.totalSessions + 1,
        totalHours: state.stats.totalHours + (focusTime / 60),
      });

      Alert.alert(
        'Focus Session Complete! 🎉',
        `Great job! You focused for ${focusTime} minutes.\n\n+${xpEarned} XP • +${coinsEarned} coins\n\nTime for a ${breakTime}-minute break!`,
        [
          { text: 'Start Break', onPress: () => setIsRunning(true) },
          { text: 'Skip Break', onPress: () => handleBreakComplete() }
        ]
      );
    } else {
      // Break completed
      handleBreakComplete();
    }
  };

  const handleBreakComplete = () => {
    setIsBreak(false);
    setTimeLeft(focusTime * 60);
    setIsCompleted(true);
    
    Alert.alert(
      'Break Complete! 💪',
      'Ready for another focus session?',
      [
        { text: 'Start New Session', onPress: () => {
          setIsCompleted(false);
          setIsRunning(true);
        }},
        { text: 'Finish', onPress: () => {
          setIsCompleted(false);
          setSessionCount(0);
        }}
      ]
    );
  };

  const startSession = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resetSession = () => {
    setIsRunning(false);
    setIsBreak(false);
    setIsCompleted(false);
    setTimeLeft(focusTime * 60);
    setSessionCount(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = (isBreak ? breakTime : focusTime) * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={isBreak ? ['#f59e0b', '#d97706'] : ['#3b82f6', '#1d4ed8']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              {isBreak ? '☕ Break Time' : '🎯 Focus Session'}
            </Text>
            <Text className="text-blue-100 text-sm">
              {isBreak ? 'Relax and recharge' : 'Deep work and concentration'}
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-2">
            <Ionicons name="timer-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Session Counter */}
        {sessionCount > 0 && (
          <View className="bg-white/20 rounded-xl p-4 mb-4">
            <Text className="text-white text-center font-semibold">
              Session {sessionCount} • {isBreak ? 'Break' : 'Focus'} Mode
            </Text>
          </View>
        )}
      </LinearGradient>

      <View className="flex-1 px-6 -mt-4">
        {/* Timer Display */}
        <View className="items-center py-8">
          <ProgressCircle
            progress={getProgress()}
            size={200}
            color={isBreak ? '#f59e0b' : '#3b82f6'}
            backgroundColor="#e5e7eb"
          >
            <View className="items-center">
              <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatTime(timeLeft)}
              </Text>
              <Text className="text-lg text-gray-600 dark:text-gray-400">
                {isBreak ? 'Break Time' : 'Focus Time'}
              </Text>
            </View>
          </ProgressCircle>
        </View>

        {/* Duration Settings (only when not running) */}
        {!isRunning && !isCompleted && (
          <View className="mb-8">
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Focus Duration
              </Text>
              <View className="flex-row flex-wrap">
                {focusDurations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => {
                      setFocusTime(duration);
                      setTimeLeft(duration * 60);
                    }}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      focusTime === duration
                        ? 'bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text className={`font-medium ${
                      focusTime === duration
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {duration}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Break Duration
              </Text>
              <View className="flex-row flex-wrap">
                {breakDurations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => setBreakTime(duration)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      breakTime === duration
                        ? 'bg-orange-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text className={`font-medium ${
                      breakTime === duration
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {duration}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mb-8">
          {!isRunning && !isCompleted ? (
            <ActionButton
              title="Start Focus Session"
              onPress={startSession}
              gradient
              gradientColors={['#3b82f6', '#1d4ed8']}
              size="lg"
              icon="▶️"
              className="w-full mb-4"
            />
          ) : isCompleted ? (
            <View>
              <ActionButton
                title="Start New Session"
                onPress={() => {
                  setIsCompleted(false);
                  setIsRunning(true);
                }}
                gradient
                gradientColors={['#10b981', '#059669']}
                size="lg"
                icon="🔄"
                className="w-full mb-4"
              />
              <ActionButton
                title="Finish"
                onPress={resetSession}
                variant="outline"
                size="lg"
                className="w-full"
              />
            </View>
          ) : (
            <View>
              <ActionButton
                title={isBreak ? "Skip Break" : "Pause Session"}
                onPress={isBreak ? handleBreakComplete : pauseSession}
                gradient
                gradientColors={isBreak ? ['#f59e0b', '#d97706'] : ['#ef4444', '#dc2626']}
                size="lg"
                icon={isBreak ? "⏭️" : "⏸️"}
                className="w-full mb-4"
              />
              <ActionButton
                title="Reset"
                onPress={resetSession}
                variant="outline"
                size="lg"
                className="w-full"
              />
            </View>
          )}
        </View>

        {/* Tips */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 {isBreak ? 'Break Tips' : 'Focus Tips'}
          </Text>
          {isBreak ? (
            <View className="space-y-2">
              <Text className="text-gray-700 dark:text-gray-300">• Stand up and stretch</Text>
              <Text className="text-gray-700 dark:text-gray-300">• Look away from your screen</Text>
              <Text className="text-gray-700 dark:text-gray-300">• Take deep breaths</Text>
              <Text className="text-gray-700 dark:text-gray-300">• Hydrate yourself</Text>
            </View>
          ) : (
            <View className="space-y-2">
              <Text className="text-gray-700 dark:text-gray-300">• Put your phone away</Text>
              <Text className="text-gray-700 dark:text-gray-300">• Close unnecessary tabs</Text>
              <Text className="text-gray-700 dark:text-gray-300">• Use noise-canceling headphones</Text>
              <Text className="text-gray-700 dark:text-gray-300">• Focus on one task at a time</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
