import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert 
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
  const [showSettings, setShowSettings] = useState(false);

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
        }
      ]
    );
  };

  const handleThemeChange = (theme) => {
    actions.setTheme(theme);
  };

  const handleSettingToggle = (setting, value) => {
    actions.updateSettings({ [setting]: value });
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
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              👤 Profile
            </Text>
            <Text className="text-purple-100 text-sm">
              Manage your account & settings
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowSettings(!showSettings)}
            className="bg-white/20 rounded-full p-2"
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <Card className="mb-4">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-4">
                <Text className="text-3xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  {state.user.username}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  {state.user.email || 'No email provided'}
                </Text>
                <Text className="text-sm text-purple-600 dark:text-purple-400">
                  Level {getLevel(state.stats.xp)} • {state.user.loginMethod} login
                </Text>
              </View>
            </View>

            {/* Level Progress */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
                  Level Progress
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {state.stats.xp} / {getNextLevelXP(state.stats.xp)} XP
                </Text>
              </View>
              <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <View 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${levelProgress}%` }}
                />
              </View>
            </View>

            {/* Stats Row */}
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {state.stats.streak}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  Day Streak
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {state.stats.totalSessions}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  Sessions
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {state.stats.coins}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  Coins
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {state.stats.badges.length}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  Badges
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-4">
        {/* Settings */}
        {showSettings && (
          <Card className="mb-6">
            <View className="p-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚙️ Settings
              </Text>

              {/* Theme Settings */}
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                  Theme
                </Text>
                <View className="flex-row">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <TouchableOpacity
                      key={theme}
                      onPress={() => handleThemeChange(theme)}
                      className={`flex-1 py-2 px-4 rounded-xl mr-2 ${
                        state.settings.theme === theme
                          ? 'bg-purple-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <Text className={`text-center font-medium capitalize ${
                        state.settings.theme === theme
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {theme}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notification Settings */}
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                  Notifications
                </Text>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-gray-600 dark:text-gray-400">
                    Enable notifications
                  </Text>
                  <Switch
                    value={state.settings.notifications}
                    onValueChange={(value) => handleSettingToggle('notifications', value)}
                    trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
                    thumbColor={state.settings.notifications ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-gray-600 dark:text-gray-400">
                    Sound effects
                  </Text>
                  <Switch
                    value={state.settings.soundEnabled}
                    onValueChange={(value) => handleSettingToggle('soundEnabled', value)}
                    trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
                    thumbColor={state.settings.soundEnabled ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">
                    Haptic feedback
                  </Text>
                  <Switch
                    value={state.settings.hapticEnabled}
                    onValueChange={(value) => handleSettingToggle('hapticEnabled', value)}
                    trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
                    thumbColor={state.settings.hapticEnabled ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
              </View>

              {/* Defocus Settings */}
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                  Default Defocus Duration
                </Text>
                <View className="flex-row">
                  {[5, 10, 15, 20, 25, 30].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      onPress={() => handleSettingToggle('defocusDuration', duration)}
                      className={`flex-1 py-2 px-3 rounded-xl mr-2 ${
                        state.settings.defocusDuration === duration
                          ? 'bg-purple-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <Text className={`text-center font-medium ${
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
            </View>
          </Card>
        )}

        {/* Recent Badges */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏆 Recent Badges
            </Text>
            {state.stats.badges.length === 0 ? (
              <View className="items-center py-4">
                <Text className="text-gray-600 dark:text-gray-400 text-center">
                  Complete activities to earn badges!
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap">
                {state.stats.badges.slice(-6).map((badge, index) => (
                  <View key={index} className="items-center mr-4 mb-4">
                    <Text className="text-3xl mb-1">{badge.icon}</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-16">
                      {badge.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>

        {/* Account Actions */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </Text>
            
            <TouchableOpacity className="flex-row items-center justify-between py-3 mb-3">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#6b7280" />
                <Text className="text-gray-700 dark:text-gray-300 ml-3">
                  Edit Profile
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3 mb-3">
              <View className="flex-row items-center">
                <Ionicons name="download-outline" size={20} color="#6b7280" />
                <Text className="text-gray-700 dark:text-gray-300 ml-3">
                  Export Data
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3 mb-3">
              <View className="flex-row items-center">
                <Ionicons name="help-circle-outline" size={20} color="#6b7280" />
                <Text className="text-gray-700 dark:text-gray-300 ml-3">
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
                <Text className="text-gray-700 dark:text-gray-300 ml-3">
                  About
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Logout Button */}
        <ActionButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          size="lg"
          className="mb-6"
        />
      </ScrollView>
    </View>
  );
}
