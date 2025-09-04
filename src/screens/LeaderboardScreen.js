import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';

export default function LeaderboardScreen() {
  const { state, actions } = useApp();
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('streak');

  const categories = [
    { id: 'streak', label: 'Streak', icon: '🔥' },
    { id: 'sessions', label: 'Sessions', icon: '🎯' },
    { id: 'xp', label: 'XP', icon: '⭐' },
    { id: 'coins', label: 'Coins', icon: '🪙' },
  ];

  useEffect(() => {
    const mockUsers = [
      { id: '1', name: 'Focus Master', avatar: '👑', streak: 15, sessions: 45, xp: 1250, coins: 320 },
      { id: '2', name: 'Mindful Mike', avatar: '🧘', streak: 12, sessions: 38, xp: 980, coins: 250 },
      { id: '3', name: 'Productive Pat', avatar: '⚡', streak: 10, sessions: 32, xp: 850, coins: 200 },
    ];

    const currentUser = {
      id: 'current',
      name: state.user.username || 'You',
      avatar: '👤',
      streak: state.stats.streak,
      sessions: state.stats.totalSessions,
      xp: state.stats.xp,
      coins: state.stats.coins,
      isCurrentUser: true,
    };

    const allUsers = [...mockUsers, currentUser];
    const sortedUsers = allUsers.sort((a, b) => b[selectedCategory] - a[selectedCategory]);
    setLeaderboard(sortedUsers);
  }, [state.stats, state.user.username, selectedCategory]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getCategoryValue = (user, category) => {
    switch (category) {
      case 'streak': return `${user.streak} days`;
      case 'sessions': return `${user.sessions} sessions`;
      case 'xp': return `${user.xp} XP`;
      case 'coins': return `${user.coins} coins`;
      default: return '';
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient colors={['#f59e0b', '#d97706']} className="px-6 pt-12 pb-8">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">🏆 Leaderboard</Text>
            <Text className="text-orange-100 text-sm">Compete with the community</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-4">
        <Card className="mb-6">
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rank by Category
            </Text>
            <View className="flex-row flex-wrap">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    selectedCategory === category.id ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {category.icon} {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card className="mb-6">
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rankings
            </Text>
            {leaderboard.map((user, index) => (
              <View key={user.id} className={`flex-row items-center justify-between py-3 px-2 rounded-lg mb-2 ${
                user.isCurrentUser ? 'bg-orange-100 dark:bg-orange-900' : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold text-gray-700 dark:text-gray-300 w-8">
                    {getRankIcon(index)}
                  </Text>
                  <Text className="text-2xl mr-3">{user.avatar}</Text>
                  <Text className={`font-semibold ${
                    user.isCurrentUser ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {user.name}
                  </Text>
                </View>
                <Text className="font-bold text-gray-900 dark:text-white">
                  {getCategoryValue(user, selectedCategory)}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
