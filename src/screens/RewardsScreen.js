import React, { useState } from 'react';
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
import ActionButton from '../components/ActionButton';

const rewardCategories = [
  {
    id: 'badges',
    title: 'Achievement Badges',
    icon: '🏆',
    color: ['#f59e0b', '#d97706']
  },
  {
    id: 'levels',
    title: 'Level Progress',
    icon: '⭐',
    color: ['#3b82f6', '#1d4ed8']
  },
  {
    id: 'streaks',
    title: 'Streak Rewards',
    icon: '🔥',
    color: ['#ef4444', '#dc2626']
  },
  {
    id: 'milestones',
    title: 'Milestones',
    icon: '🎯',
    color: ['#10b981', '#059669']
  }
];

const availableRewards = [
  {
    id: '1',
    title: 'Focus Master',
    description: 'Complete 10 focus sessions',
    icon: '🎯',
    cost: 0,
    type: 'badge',
    requirement: { type: 'sessions', value: 10 },
    unlocked: false
  },
  {
    id: '2',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    cost: 0,
    type: 'badge',
    requirement: { type: 'streak', value: 7 },
    unlocked: false
  },
  {
    id: '3',
    title: 'Journal Keeper',
    description: 'Write 25 journal entries',
    icon: '📝',
    cost: 0,
    type: 'badge',
    requirement: { type: 'journal', value: 25 },
    unlocked: false
  },
  {
    id: '4',
    title: 'Game Master',
    description: 'Play 50 games',
    icon: '🎮',
    cost: 0,
    type: 'badge',
    requirement: { type: 'games', value: 50 },
    unlocked: false
  },
  {
    id: '5',
    title: 'XP Collector',
    description: 'Earn 1000 XP',
    icon: '⭐',
    cost: 0,
    type: 'badge',
    requirement: { type: 'xp', value: 1000 },
    unlocked: false
  },
  {
    id: '6',
    title: 'Coin Hoarder',
    description: 'Collect 500 coins',
    icon: '🪙',
    cost: 0,
    type: 'badge',
    requirement: { type: 'coins', value: 500 },
    unlocked: false
  }
];

const shopItems = [
  {
    id: '1',
    title: 'Extra Focus Time',
    description: 'Add 5 minutes to your next focus session',
    icon: '⏰',
    cost: 50,
    type: 'boost'
  },
  {
    id: '2',
    title: 'Double XP Boost',
    description: 'Earn double XP for your next 3 sessions',
    icon: '⚡',
    cost: 100,
    type: 'boost'
  },
  {
    id: '3',
    title: 'Streak Protection',
    description: 'Protect your streak from breaking once',
    icon: '🛡️',
    cost: 150,
    type: 'protection'
  },
  {
    id: '4',
    title: 'Custom Theme',
    description: 'Unlock a new app theme',
    icon: '🎨',
    cost: 200,
    type: 'cosmetic'
  },
  {
    id: '5',
    title: 'Premium Music Pack',
    description: 'Access to exclusive focus music',
    icon: '🎵',
    cost: 300,
    type: 'content'
  }
];

export default function RewardsScreen() {
  const { state, actions } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('badges');
  const [selectedTab, setSelectedTab] = useState('rewards'); // 'rewards' or 'shop'

  const getLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const getNextLevelXP = (xp) => {
    const currentLevel = getLevel(xp);
    return currentLevel * 100;
  };

  const levelProgress = (state.stats.xp % 100) / 100 * 100;

  const checkRewardUnlocked = (reward) => {
    switch (reward.requirement.type) {
      case 'sessions':
        return state.stats.totalSessions >= reward.requirement.value;
      case 'streak':
        return state.stats.streak >= reward.requirement.value;
      case 'journal':
        return state.stats.journalEntries >= reward.requirement.value;
      case 'games':
        return (state.games.memoryMatch.gamesPlayed + state.games.tapGame.gamesPlayed) >= reward.requirement.value;
      case 'xp':
        return state.stats.xp >= reward.requirement.value;
      case 'coins':
        return state.stats.coins >= reward.requirement.value;
      default:
        return false;
    }
  };

  const purchaseItem = (item) => {
    if (state.stats.coins >= item.cost) {
      actions.updateStats({
        coins: state.stats.coins - item.cost
      });
      // Here you would implement the actual boost/item effect
      Alert.alert('Purchase Successful!', `You've purchased ${item.title}!`);
    } else {
      Alert.alert('Insufficient Coins', 'You need more coins to purchase this item.');
    }
  };

  const renderRewardItem = ({ item }) => {
    const isUnlocked = checkRewardUnlocked(item);
    const isEarned = state.stats.badges.some(badge => badge.id === item.id);

    return (
      <Card className="mb-3">
        <View className="p-4">
          <View className="flex-row items-center">
            <View className={`w-16 h-16 rounded-full items-center justify-center mr-4 ${
              isEarned ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Text className="text-2xl">{item.icon}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {item.description}
              </Text>
              <View className="flex-row items-center">
                {isEarned ? (
                  <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                    <Text className="text-green-800 dark:text-green-200 text-xs font-medium">
                      ✅ Earned
                    </Text>
                  </View>
                ) : isUnlocked ? (
                  <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                    <Text className="text-blue-800 dark:text-blue-200 text-xs font-medium">
                      🎉 Unlocked!
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    <Text className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                      🔒 Locked
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const renderShopItem = ({ item }) => {
    const canAfford = state.stats.coins >= item.cost;

    return (
      <Card className="mb-3">
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Text className="text-3xl mr-4">{item.icon}</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.description}
                </Text>
                <Text className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {item.cost} coins
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => purchaseItem(item)}
              disabled={!canAfford}
              className={`px-4 py-2 rounded-full ${
                canAfford 
                  ? 'bg-orange-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Text className={`font-medium ${
                canAfford ? 'text-white' : 'text-gray-500'
              }`}>
                Buy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              🎁 Rewards
            </Text>
            <Text className="text-purple-100 text-sm">
              Earn achievements and spend coins
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white font-bold text-2xl">
              {state.stats.coins}
            </Text>
            <Text className="text-purple-100 text-sm">Coins</Text>
          </View>
        </View>

        {/* Level Progress */}
        <Card className="mb-4">
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-semibold">
                Level {getLevel(state.stats.xp)}
              </Text>
              <Text className="text-purple-100 text-sm">
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
        </Card>
      </LinearGradient>

      <View className="flex-1 px-6 -mt-4">
        {/* Tab Selection */}
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setSelectedTab('rewards')}
            className={`flex-1 py-3 px-4 rounded-l-xl ${
              selectedTab === 'rewards'
                ? 'bg-purple-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className={`text-center font-semibold ${
              selectedTab === 'rewards'
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              🏆 Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('shop')}
            className={`flex-1 py-3 px-4 rounded-r-xl ${
              selectedTab === 'shop'
                ? 'bg-purple-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className={`text-center font-semibold ${
              selectedTab === 'shop'
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              🛒 Shop
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'rewards' ? (
          <View>
            {/* Category Selection */}
            <View className="flex-row mb-6">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                  {rewardCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      className={`mr-3 px-4 py-2 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-purple-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <Text className={`font-medium ${
                        selectedCategory === category.id
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {category.icon} {category.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Rewards List */}
            <FlatList
              data={availableRewards}
              renderItem={renderRewardItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View>
            {/* Shop Items */}
            <FlatList
              data={shopItems}
              renderItem={renderShopItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Stats Summary */}
        <Card className="mb-6 mt-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Your Progress
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {state.stats.badges.length}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Badges Earned
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {getLevel(state.stats.xp)}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Current Level
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {state.stats.streak}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Day Streak
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}
