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
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

export default function ProfileScreen() {
  const { state, actions } = useApp();
  const navigation = useNavigation();
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
            navigation.navigate('Login');
          }
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your progress, journal entries, and game scores. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset all data
            actions.updateStats({
              streak: 0,
              totalSessions: 0,
              totalHours: 0,
              journalEntries: 0,
              xp: 0,
              coins: 0,
              todaySessions: 0,
              todayGoal: 5,
            });
            Alert.alert('Success', 'All data has been reset.');
          }
        },
      ]
    );
  };

  const toggleNotifications = (value) => {
    setNotifications(value);
    actions.updateSettings({ notifications: value });
  };

  const getLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const getNextLevelXP = (xp) => {
    const currentLevel = getLevel(xp);
    return currentLevel * 100;
  };

  const levelProgress = (state.stats.xp % 100) / 100 * 100;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        className="px-6 pt-12 pb-8"
      >
        <View className="items-center">
          <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">
            {state.user.username}
          </Text>
          <Text className="text-purple-100 text-sm">
            Level {getLevel(state.stats.xp)} • {state.stats.xp} XP
          </Text>
        </View>
      </LinearGradient>

      <View className="px-6 -mt-4">
        {/* Level Progress */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏆 Level Progress
            </Text>
            
            <View className="items-center mb-4">
              <Text className="text-3xl font-bold text-purple-600">
                Level {getLevel(state.stats.xp)}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {state.stats.xp} / {getNextLevelXP(state.stats.xp)} XP
              </Text>
            </View>
            
            <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <View 
                className="bg-purple-500 h-3 rounded-full"
                style={{ width: `${levelProgress}%` }}
              />
            </View>
            
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              {getNextLevelXP(state.stats.xp) - state.stats.xp} XP to next level
            </Text>
          </View>
        </Card>

        {/* Stats Overview */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Your Stats
            </Text>
            
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] mb-4">
                <Text className="text-2xl font-bold text-blue-600">
                  {state.stats.totalSessions}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Sessions
                </Text>
              </View>
              <View className="w-[48%] mb-4">
                <Text className="text-2xl font-bold text-green-600">
                  {state.stats.totalHours.toFixed(1)}h
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hours Focused
                </Text>
              </View>
              <View className="w-[48%] mb-4">
                <Text className="text-2xl font-bold text-purple-600">
                  {state.stats.streak}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Day Streak
                </Text>
              </View>
              <View className="w-[48%] mb-4">
                <Text className="text-2xl font-bold text-yellow-600">
                  {state.stats.coins}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Coins Earned
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⚙️ Settings
            </Text>
            
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Ionicons name="notifications-outline" size={24} color="#6b7280" />
                <Text className="text-gray-900 dark:text-white ml-3">
                  Notifications
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
                thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
              />
            </View>
            
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={24} color="#6b7280" />
                <Text className="text-gray-900 dark:text-white ml-3">
                  Default Defocus Duration
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-400">
                {state.settings.defocusDuration} min
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View className="mb-6">
          <ActionButton
            title="Reset All Data"
            onPress={handleResetData}
            variant="outline"
            size="lg"
            className="w-full mb-4"
          />
          
          <ActionButton
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            size="lg"
            className="w-full"
          />
        </View>

        {/* App Info */}
        <Card className="mb-6">
          <View className="p-6 items-center">
            <Text className="text-4xl mb-4">🎯</Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Defocus2Focus
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              Version 1.0.0{'\n'}
              Where Productivity Meets Play
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}