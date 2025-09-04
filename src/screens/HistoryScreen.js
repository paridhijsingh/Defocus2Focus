import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';

export default function HistoryScreen() {
  const { state } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'defocus', 'games', 'journal'
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'all'

  const filters = [
    { id: 'all', label: 'All', icon: '📊' },
    { id: 'defocus', label: 'Defocus', icon: '🎯' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'journal', label: 'Journal', icon: '📝' },
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  const filteredHistory = useMemo(() => {
    let filtered = state.history;

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(entry => entry.type === selectedFilter);
    }

    // Filter by period
    const now = new Date();
    if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= weekAgo);
    } else if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= monthAgo);
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [state.history, selectedFilter, selectedPeriod]);

  const analytics = useMemo(() => {
    const totalSessions = state.history.filter(h => h.type === 'defocus').length;
    const totalGames = state.history.filter(h => h.type === 'game').length;
    const totalJournalEntries = state.journalEntries.length;
    const totalXP = state.history.reduce((sum, h) => sum + (h.xpEarned || 0), 0);
    const totalCoins = state.history.reduce((sum, h) => sum + (h.coinsEarned || 0), 0);
    const totalHours = state.history
      .filter(h => h.type === 'defocus')
      .reduce((sum, h) => sum + (h.duration || 0), 0) / 60;

    return {
      totalSessions,
      totalGames,
      totalJournalEntries,
      totalXP,
      totalCoins,
      totalHours,
    };
  }, [state.history, state.journalEntries]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderHistoryItem = ({ item }) => {
    const getItemIcon = () => {
      switch (item.type) {
        case 'defocus':
          return '🎯';
        case 'game':
          return '🎮';
        case 'journal':
          return '📝';
        default:
          return '📊';
      }
    };

    const getItemTitle = () => {
      switch (item.type) {
        case 'defocus':
          return `Defocus Session - ${formatDuration(item.duration)}`;
        case 'game':
          return `${item.gameType === 'memoryMatch' ? 'Memory Match' : 'Speed Tap'} - ${item.score} points`;
        case 'journal':
          return item.title || 'Journal Entry';
        default:
          return 'Activity';
      }
    };

    const getItemSubtitle = () => {
      switch (item.type) {
        case 'defocus':
          return `+${item.xpEarned} XP • +${item.coinsEarned} coins`;
        case 'game':
          return `+${item.xpEarned} XP • +${item.coinsEarned} coins`;
        case 'journal':
          return `${item.content?.substring(0, 50)}...`;
        default:
          return '';
      }
    };

    return (
      <Card className="mb-3">
        <View className="p-4">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">{getItemIcon()}</Text>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {getItemTitle()}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {getItemSubtitle()}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-500">
                {formatDate(item.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              📊 History
            </Text>
            <Text className="text-green-100 text-sm">
              Track your progress & achievements
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-2">
            <Ionicons name="analytics-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-4">
        {/* Analytics Overview */}
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <StatCard
              title="Total Sessions"
              value={analytics.totalSessions}
              icon="🎯"
              gradient
              gradientColors={['#3b82f6', '#1d4ed8']}
            />
          </View>
          <View className="flex-1 mx-1">
            <StatCard
              title="Hours Focused"
              value={`${analytics.totalHours.toFixed(1)}h`}
              icon="⏰"
              gradient
              gradientColors={['#f59e0b', '#d97706']}
            />
          </View>
          <View className="flex-1 ml-2">
            <StatCard
              title="Games Played"
              value={analytics.totalGames}
              icon="🎮"
              gradient
              gradientColors={['#8b5cf6', '#7c3aed']}
            />
          </View>
        </View>

        <View className="flex-row justify-between mb-6">
          <View className="flex-1 mr-2">
            <StatCard
              title="Total XP"
              value={analytics.totalXP}
              icon="⭐"
              gradient
              gradientColors={['#f59e0b', '#d97706']}
            />
          </View>
          <View className="flex-1 mx-1">
            <StatCard
              title="Coins Earned"
              value={analytics.totalCoins}
              icon="🪙"
              gradient
              gradientColors={['#10b981', '#059669']}
            />
          </View>
          <View className="flex-1 ml-2">
            <StatCard
              title="Journal Entries"
              value={analytics.totalJournalEntries}
              icon="📝"
              gradient
              gradientColors={['#ef4444', '#dc2626']}
            />
          </View>
        </View>

        {/* Filters */}
        <Card className="mb-6">
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filter by Type
            </Text>
            <View className="flex-row flex-wrap">
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    selectedFilter === filter.id
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedFilter === filter.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {filter.icon} {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Period Filter */}
        <Card className="mb-6">
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Time Period
            </Text>
            <View className="flex-row">
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  onPress={() => setSelectedPeriod(period.id)}
                  className={`flex-1 py-2 px-4 rounded-xl mr-2 ${
                    selectedPeriod === period.id
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`text-center font-medium ${
                    selectedPeriod === period.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* History List */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {filteredHistory.length} items
            </Text>
          </View>

          {filteredHistory.length === 0 ? (
            <Card>
              <View className="p-8 items-center">
                <Text className="text-6xl mb-4">📊</Text>
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No activity yet
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center">
                  Start using the app to see your activity history here.
                </Text>
              </View>
            </Card>
          ) : (
            <FlatList
              data={filteredHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Progress Insights */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📈 Progress Insights
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700 dark:text-gray-300">
                  Current Streak
                </Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {state.stats.streak} days
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700 dark:text-gray-300">
                  Level Progress
                </Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {state.stats.xp} / {Math.ceil(state.stats.xp / 100) * 100} XP
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700 dark:text-gray-300">
                  Badges Earned
                </Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {state.stats.badges.length} badges
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
