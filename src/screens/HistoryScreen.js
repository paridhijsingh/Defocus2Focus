import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';

export default function HistoryScreen() {
  const { state } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'defocus', 'journal', 'game'

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'defocus':
        return '🎯';
      case 'journal':
        return '📝';
      case 'game':
        return '🎮';
      default:
        return '📊';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'defocus':
        return '#3b82f6';
      case 'journal':
        return '#8b5cf6';
      case 'game':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredHistory = state.history.filter(entry => {
    if (filter === 'all') return true;
    return entry.type === filter;
  });

  const groupHistoryByDate = (history) => {
    const grouped = {};
    history.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    return grouped;
  };

  const groupedHistory = groupHistoryByDate(filteredHistory);

  const getActivityDescription = (entry) => {
    switch (entry.type) {
      case 'defocus':
        return `${entry.duration} minute defocus session`;
      case 'journal':
        return `Journal entry: ${entry.title || 'Untitled'}`;
      case 'game':
        return `${entry.gameType} game - Score: ${entry.score}`;
      default:
        return 'Activity';
    }
  };

  const getRewardsText = (entry) => {
    const rewards = [];
    if (entry.xpEarned) rewards.push(`+${entry.xpEarned} XP`);
    if (entry.coinsEarned) rewards.push(`+${entry.coinsEarned} coins`);
    return rewards.join(' • ');
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient
        colors={['#6b7280', '#4b5563']}
        className="px-6 pt-12 pb-8"
      >
        <Text className="text-white text-2xl font-bold mb-2">
          Activity History 📊
        </Text>
        <Text className="text-gray-200 text-sm">
          Track your productivity journey
        </Text>
      </LinearGradient>

      <ScrollView 
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filter Buttons */}
        <View className="flex-row justify-between mb-6 mt-4">
          {[
            { key: 'all', label: 'All', icon: '📊' },
            { key: 'defocus', label: 'Focus', icon: '🎯' },
            { key: 'journal', label: 'Journal', icon: '📝' },
            { key: 'game', label: 'Games', icon: '🎮' },
          ].map((filterOption) => (
            <TouchableOpacity
              key={filterOption.key}
              onPress={() => setFilter(filterOption.key)}
              className={`px-3 py-2 rounded-lg ${
                filter === filterOption.key
                  ? 'bg-blue-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Text className={`text-sm font-medium ${
                filter === filterOption.key
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {filterOption.icon} {filterOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Summary */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📈 This Week
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">
                  {state.history.filter(h => h.type === 'defocus').length}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Focus Sessions
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">
                  {state.history.filter(h => h.type === 'journal').length}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Journal Entries
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {state.history.filter(h => h.type === 'game').length}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Games Played
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* History Timeline */}
        {Object.keys(groupedHistory).length === 0 ? (
          <Card>
            <View className="p-8 items-center">
              <Text className="text-4xl mb-4">📊</Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center text-lg mb-2">
                No activity yet
              </Text>
              <Text className="text-gray-500 dark:text-gray-500 text-center">
                Start using the app to build your activity history!
              </Text>
            </View>
          </Card>
        ) : (
          Object.entries(groupedHistory)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, entries]) => (
              <View key={date} className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {formatDate(entries[0].timestamp)}
                </Text>
                
                {entries
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((entry, index) => (
                    <Card key={`${entry.id}-${index}`} className="mb-3">
                      <View className="p-4">
                        <View className="flex-row items-start">
                          <View 
                            className="w-12 h-12 rounded-full items-center justify-center mr-4"
                            style={{ backgroundColor: getActivityColor(entry.type) + '20' }}
                          >
                            <Text className="text-2xl">
                              {getActivityIcon(entry.type)}
                            </Text>
                          </View>
                          
                          <View className="flex-1">
                            <Text className="font-semibold text-gray-900 dark:text-white mb-1">
                              {getActivityDescription(entry)}
                            </Text>
                            
                            <View className="flex-row items-center justify-between">
                              <Text className="text-sm text-gray-600 dark:text-gray-400">
                                {formatTime(entry.timestamp)}
                              </Text>
                              
                              {getRewardsText(entry) && (
                                <Text className="text-sm text-green-600 font-medium">
                                  {getRewardsText(entry)}
                                </Text>
                              )}
                            </View>
                            
                            {entry.type === 'defocus' && (
                              <View className="mt-2">
                                <View className="flex-row items-center">
                                  <View className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <View 
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: '100%' }}
                                    />
                                  </View>
                                  <Text className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                    {entry.duration}min
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </Card>
                  ))}
              </View>
            ))
        )}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
