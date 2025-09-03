import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Reusable Card Component
const Card = ({ title, icon, onPress, gradient, isLarge = false, children }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradient}
          className={`rounded-2xl shadow-lg p-6 ${isLarge ? 'h-32' : 'h-24'} justify-center items-center`}
          style={{ width: isLarge ? width * 0.9 : width * 0.4 }}
        >
          {children || (
            <>
              <Text className="text-3xl mb-2">{icon}</Text>
              <Text className="text-white font-semibold text-center text-sm">
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Progress Circle Component
const ProgressCircle = ({ progress, size = 80, strokeWidth = 8, color = '#3B82F6' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center">
      <View className="relative">
        <View
          className="rounded-full border-4 border-gray-200"
          style={{ width: size, height: size }}
        />
        <View
          className="absolute rounded-full border-4"
          style={{
            width: size,
            height: size,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: [{ rotate: `${(progress / 100) * 360}deg` }],
          }}
        />
        <View className="absolute inset-0 justify-center items-center">
          <Text className="text-lg font-bold text-gray-800 dark:text-white">
            {progress}%
          </Text>
        </View>
      </View>
    </View>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900',
    green: 'bg-green-100 dark:bg-green-900',
    purple: 'bg-purple-100 dark:bg-purple-900',
  };

  const textColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <View className={`${colorClasses[color]} rounded-xl p-4 flex-1 mx-1`}>
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className={`text-2xl font-bold ${textColorClasses[color]}`}>
        {value}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1">
        {title}
      </Text>
    </View>
  );
};

// Main Dashboard Component
const Dashboard = ({ username = 'User', setCurrentScreen }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [todayProgress, setTodayProgress] = useState(60); // 3/5 sessions = 60%
  const [streak, setStreak] = useState(7);

  // Motivational quotes
  const quotes = [
    "Every expert was once a beginner. Every pro was once an amateur.",
    "The way to get started is to quit talking and begin doing.",
    "Don't be afraid to give up the good to go for the great.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    // Rotate quotes every 10 seconds
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCardPress = (screenName) => {
    if (setCurrentScreen) {
      setCurrentScreen(screenName);
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      showsVerticalScrollIndicator={false}
    >
      {/* Top Section */}
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Hi {username} 👋
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-lg">🔥</Text>
              <Text className="text-gray-600 dark:text-gray-400 ml-1">
                {streak}-day streak
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full justify-center items-center"
          >
            <Text className="text-xl">{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <Text className="text-gray-700 dark:text-gray-300 text-center italic">
            "{currentQuote}"
          </Text>
        </View>
      </View>

      {/* Middle Section - Progress & Stats */}
      <View className="px-6 mb-6">
        {/* Today's Progress */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Today's Focus Progress
          </Text>
          <ProgressCircle progress={todayProgress} size={100} />
          <Text className="text-center text-gray-600 dark:text-gray-400 mt-2">
            3 of 5 sessions completed
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row mb-4">
          <StatCard
            title="Total Sessions"
            value="47"
            icon="🎯"
            color="blue"
          />
          <StatCard
            title="Hours Focused"
            value="23.5"
            icon="⏰"
            color="green"
          />
          <StatCard
            title="Journal Entries"
            value="12"
            icon="📝"
            color="purple"
          />
        </View>
      </View>

      {/* Main Actions Grid */}
      <View className="px-6 mb-6">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </Text>
        
        {/* Start Defocus - Large Card */}
        <View className="items-center mb-4">
          <Card
            title="Start Defocus"
            onPress={() => handleCardPress('defocus')}
            gradient={['#667eea', '#764ba2']}
            isLarge={true}
          >
            <Text className="text-4xl mb-2">🚀</Text>
            <Text className="text-white font-bold text-lg">Start Defocus</Text>
            <Text className="text-white/80 text-sm">Begin your focus session</Text>
          </Card>
        </View>

        {/* Feature Cards Grid */}
        <View className="flex-row flex-wrap justify-between">
          <Card
            title="Journal"
            icon="📓"
            onPress={() => handleCardPress('journal')}
            gradient={['#f093fb', '#f5576c']}
          />
          <Card
            title="Games"
            icon="🎮"
            onPress={() => handleCardPress('games')}
            gradient={['#4facfe', '#00f2fe']}
          />
          <Card
            title="AI Therapist"
            icon="🤖"
            onPress={() => handleCardPress('aiTherapist')}
            gradient={['#43e97b', '#38f9d7']}
          />
          <Card
            title="Leaderboard"
            icon="🏆"
            onPress={() => handleCardPress('leaderboard')}
            gradient={['#fa709a', '#fee140']}
          />
          <Card
            title="History"
            icon="📊"
            onPress={() => handleCardPress('history')}
            gradient={['#a8edea', '#fed6e3']}
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-8">
        {/* Today's Focus Goal Progress */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Focus Goal
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-600 dark:text-gray-400">Progress</Text>
            <Text className="text-gray-900 dark:text-white font-semibold">
              3/5 hours
            </Text>
          </View>
          <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <View 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              style={{ width: '60%' }}
            />
          </View>
        </View>

        {/* Challenge a Friend Button */}
        <TouchableOpacity
          onPress={() => handleCardPress('challenge')}
          className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 shadow-lg"
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-2xl mr-2">⚔️</Text>
            <Text className="text-white font-bold text-lg">
              Challenge a Friend
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
