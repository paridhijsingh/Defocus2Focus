import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Switch 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ActionButton from '../components/ActionButton';

export default function ProfileScreen() {
  const { state, actions } = useApp();
  const [notifications, setNotifications] = useState(state.settings.notifications);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            actions.logout();
            actions.setCurrentScreen('Login');
          }
        },
      ]
    );
  };

  const handleThemeChange = (theme) => {
    actions.updateSettings({ theme });
  };

  const handleDefocusDurationChange = (duration) => {
    actions.updateSettings({ defocusDuration: duration });
  };

  const handleNotificationToggle = (value) => {
    setNotifications(value);
    actions.updateSettings({ notifications: value });
  };

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first defocus session',
      icon: '🎯',
      unlocked: state.stats.totalSessions > 0,
      progress: Math.min(state.stats.totalSessions, 1),
      maxProgress: 1,
    },
    {
      id: 2,
      title: 'Writer',
      description: 'Write your first journal entry',
      icon: '📝',
      unlocked: state.stats.journalEntries > 0,
      progress: Math.min(state.stats.journalEntries, 1),
      maxProgress: 1,
    },
    {
      id: 3,
      title: 'Gamer',
      description: 'Play your first game',
      icon: '🎮',
      unlocked: (state.games.memoryMatch?.gamesPlayed || 0) + (state.games.tapGame?.gamesPlayed || 0) > 0,
      progress: Math.min((state.games.memoryMatch?.gamesPlayed || 0) + (state.games.tapGame?.gamesPlayed || 0), 1),
      maxProgress: 1,
    },
    {
      id: 4,
      title: 'Streak Master',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: state.stats.streak >= 7,
      progress: Math.min(state.stats.streak, 7),
      maxProgress: 7,
    },
    {
      id: 5,
      title: 'Focused',
      description: 'Complete 10 defocus sessions',
      icon: '🎯',
      unlocked: state.stats.totalSessions >= 10,
      progress: Math.min(state.stats.totalSessions, 10),
      maxProgress: 10,
    },
    {
      id: 6,
      title: 'Reflective',
      description: 'Write 5 journal entries',
      icon: '📝',
      unlocked: state.stats.journalEntries >= 5,
      progress: Math.min(state.stats.journalEntries, 5),
      maxProgress: 5,
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="px-6 pt-12 pb-8"
      >
        <View className="items-center">
          <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">
            {state.user.username}
          </Text>
          <Text className="text-blue-100 text-sm">
            Member since {new Date().toLocaleDateString()}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6">
        {/* Stats Overview */}
        <View className="flex-row justify-between mb-6 -mt-4">
          <View className="flex-1 mr-2">
            <StatCard
              title="XP Earned"
              value={state.stats.xp}
              icon="⚡"
              gradient
              gradientColors={['#f59e0b', '#d97706']}
            />
          </View>
          <View className="flex-1 mx-1">
            <StatCard
              title="Coins"
              value={state.stats.coins}
              icon="🪙"
              gradient
              gradientColors={['#10b981', '#059669']}
            />
          </View>
          <View className="flex-1 ml-2">
            <StatCard
              title="Streak"
              value={`${state.stats.streak}d`}
              icon="🔥"
              gradient
              gradientColors={['#ef4444', '#dc2626']}
            />
          </View>
        </View>

        {/* Achievements */}
        <Card className="mb-6">
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                🏆 Achievements
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {unlockedAchievements}/{achievements.length}
              </Text>
            </View>
            
            <View className="flex-row flex-wrap justify-between">
              {achievements.map((achievement) => (
                <View key={achievement.id} className="w-[48%] mb-4">
                  <View className={`p-4 rounded-xl ${
                    achievement.unlocked 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <Text className="text-2xl mb-2 text-center">
                      {achievement.icon}
                    </Text>
                    <Text className={`font-semibold text-center mb-1 ${
                      achievement.unlocked 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {achievement.title}
                    </Text>
                    <Text className={`text-xs text-center mb-2 ${
                      achievement.unlocked 
                        ? 'text-green-600 dark:text-green-300' 
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {achievement.description}
                    </Text>
                    <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <View 
                        className={`h-1 rounded-full ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        style={{ 
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                        }}
                      />
                    </View>
                    <Text className={`text-xs text-center mt-1 ${
                      achievement.unlocked 
                        ? 'text-green-600 dark:text-green-300' 
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {achievement.progress}/{achievement.maxProgress}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⚙️ Settings
            </Text>
            
            {/* Theme Selection */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                Theme
              </Text>
              <View className="flex-row space-x-2">
                {[
                  { key: 'light', label: 'Light', icon: '☀️' },
                  { key: 'dark', label: 'Dark', icon: '🌙' },
                  { key: 'auto', label: 'Auto', icon: '🔄' },
                ].map((theme) => (
                  <TouchableOpacity
                    key={theme.key}
                    onPress={() => handleThemeChange(theme.key)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                      state.settings.theme === theme.key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <Text className="text-center text-lg mb-1">{theme.icon}</Text>
                    <Text className={`text-center text-sm font-medium ${
                      state.settings.theme === theme.key
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {theme.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Defocus Duration */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                Default Defocus Duration
              </Text>
              <View className="flex-row flex-wrap">
                {[5, 10, 15, 20, 25, 30].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => handleDefocusDurationChange(duration)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-lg ${
                      state.settings.defocusDuration === duration
                        ? 'bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text className={`font-medium ${
                      state.settings.defocusDuration === duration
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {duration}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notifications */}
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
                  Notifications
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Get reminders for sessions
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>
        </Card>

        {/* Account Actions */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </Text>
            
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <Text className="ml-3 text-gray-700 dark:text-gray-300">
                Edit Profile
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <Ionicons name="shield-outline" size={20} color="#6b7280" />
              <Text className="ml-3 text-gray-700 dark:text-gray-300">
                Privacy & Security
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center py-3">
              <Ionicons name="help-circle-outline" size={20} color="#6b7280" />
              <Text className="ml-3 text-gray-700 dark:text-gray-300">
                Help & Support
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Logout Button */}
        <ActionButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          className="mb-8"
        />

        {/* App Version */}
        <Text className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
          Defocus2Focus v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
