import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ProgressCircle from '../components/ProgressCircle';
import ActionButton from '../components/ActionButton';

const motivationalQuotes = [
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Focus on being productive instead of busy. - Tim Ferriss",
  "The secret of getting ahead is getting started. - Mark Twain",
];

export default function DashboardScreen() {
  const { state, actions } = useApp();
  const navigation = useNavigation();
  const [currentQuote, setCurrentQuote] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Set a random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleStartDefocus = () => {
    actions.setDefocusLock(true);
    navigation.navigate('DefocusLock');
  };

  const todayProgress = (state.stats.todaySessions / state.stats.todayGoal) * 100;

  const getLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const getNextLevelXP = (xp) => {
    const currentLevel = getLevel(xp);
    return currentLevel * 100;
  };

  const levelProgress = (state.stats.xp % 100) / 100 * 100;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-lg">
              Hi {state.user.username} 👋
            </Text>
            <Text className="text-blue-100 text-sm">
              Level {getLevel(state.stats.xp)} • Ready to focus?
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-2">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Level Progress */}
        <View className="bg-white/20 rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-semibold">
              Level {getLevel(state.stats.xp)}
            </Text>
            <Text className="text-blue-100 text-sm">
              {state.stats.xp} / {getNextLevelXP(state.stats.xp)} XP
            </Text>
          </View>
          <View className="w-full bg-white/20 rounded-full h-2">
            <View 
              className="bg-white h-2 rounded-full"
              style={{ width: `${levelProgress}%` }}
            />
          </View>
        </View>

        {/* Streak Tracker */}
        <View className="bg-white/20 rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white font-semibold text-lg">
                🔥 {state.stats.streak} Day Streak
              </Text>
              <Text className="text-blue-100 text-sm">
                Keep it going!
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-white font-bold text-2xl">
                {state.stats.coins}
              </Text>
              <Text className="text-blue-100 text-sm">Coins</Text>
            </View>
          </View>
        </View>

        {/* Motivational Quote */}
        <View className="bg-white/10 rounded-xl p-4">
          <Text className="text-white text-sm italic text-center">
            "{currentQuote}"
          </Text>
        </View>
      </LinearGradient>

      <View className="px-6 -mt-4">
        {/* Progress Section */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Today's Progress
            </Text>
            
            <View className="flex-row items-center justify-between">
              <ProgressCircle
                progress={todayProgress}
                size={100}
                color="#3b82f6"
                backgroundColor="#e5e7eb"
              >
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    {state.stats.todaySessions}
                  </Text>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    / {state.stats.todayGoal}
                  </Text>
                </View>
              </ProgressCircle>
              
              <View className="flex-1 ml-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-400">Sessions</Text>
                  <Text className="font-semibold text-gray-900 dark:text-white">
                    {state.stats.todaySessions}/{state.stats.todayGoal}
                  </Text>
                </View>
                <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <View 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${todayProgress}%` }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Stats Grid */}
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 mr-2">
            <StatCard
              title="Total Sessions"
              value={state.stats.totalSessions}
              icon="🎯"
              gradient
              gradientColors={['#10b981', '#059669']}
            />
          </View>
          <View className="flex-1 mx-1">
            <StatCard
              title="Hours Focused"
              value={`${state.stats.totalHours.toFixed(1)}h`}
              icon="⏰"
              gradient
              gradientColors={['#f59e0b', '#d97706']}
            />
          </View>
          <View className="flex-1 ml-2">
            <StatCard
              title="Journal Entries"
              value={state.stats.journalEntries}
              icon="📝"
              gradient
              gradientColors={['#8b5cf6', '#7c3aed']}
            />
          </View>
        </View>

        {/* Main Actions */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </Text>
          
          {/* Start Defocus - Large Card */}
          <View className="mb-4">
            <ActionButton
              title="Start Defocus Session"
              onPress={handleStartDefocus}
              gradient
              gradientColors={['#3b82f6', '#1d4ed8']}
              size="lg"
              icon="🎯"
              className="w-full"
            />
          </View>

          {/* Feature Grid */}
          <View className="flex-row flex-wrap justify-between">
            <Card 
              onPress={() => navigation.navigate('Journal')}
              className="w-[48%] mb-3"
            >
              <View className="p-4 items-center">
                <Text className="text-3xl mb-2">📓</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  Journal
                </Text>
              </View>
            </Card>

            <Card 
              onPress={() => navigation.navigate('Games')}
              className="w-[48%] mb-3"
            >
              <View className="p-4 items-center">
                <Text className="text-3xl mb-2">🎮</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  Games
                </Text>
              </View>
            </Card>

            <Card 
              onPress={() => navigation.navigate('History')}
              className="w-[48%] mb-3"
            >
              <View className="p-4 items-center">
                <Text className="text-3xl mb-2">📊</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  History
                </Text>
              </View>
            </Card>

            <Card 
              onPress={() => navigation.navigate('Leaderboard')}
              className="w-[48%] mb-3"
            >
              <View className="p-4 items-center">
                <Text className="text-3xl mb-2">🏆</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  Leaderboard
                </Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Recent Badges */}
        {state.stats.badges.length > 0 && (
          <Card className="mb-6">
            <View className="p-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🏆 Recent Badges
              </Text>
              <View className="flex-row flex-wrap">
                {state.stats.badges.slice(-3).map((badge, index) => (
                  <View key={index} className="items-center mr-4 mb-2">
                    <Text className="text-2xl mb-1">{badge.icon}</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      {badge.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        )}

        {/* Bottom Section - Today's Goal */}
        <Card className="mb-6">
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Today's Goal
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {state.stats.todaySessions}/{state.stats.todayGoal} sessions
              </Text>
            </View>
            
            <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <View 
                className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
                style={{ width: `${todayProgress}%` }}
              />
            </View>
            
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {state.stats.todayGoal - state.stats.todaySessions} more sessions to reach your goal!
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
