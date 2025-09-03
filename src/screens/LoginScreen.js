import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ActionButton from '../components/ActionButton';

export default function LoginScreen() {
  const { actions } = useApp();
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      actions.login(username.trim());
      setLoading(false);
    }, 1000);
  };

  const handleSignUp = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      actions.login(username.trim());
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="flex-1 justify-center items-center px-8"
      >
        <View className="w-full max-w-sm">
          {/* Logo and Title */}
          <View className="items-center mb-12">
            <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 shadow-lg">
              <Text className="text-4xl">🎯</Text>
            </View>
            <Text className="text-3xl font-bold text-white mb-2">
              Defocus2Focus
            </Text>
            <Text className="text-blue-100 text-center">
              Where Productivity Meets Play
            </Text>
          </View>

          {/* Form */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              {isSignUp ? 'Start your productivity journey' : 'Sign in to continue'}
            </Text>

            {/* Username Input */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Username
              </Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-600">
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color="#6b7280" 
                  className="mr-3"
                />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-gray-900 dark:text-white text-base"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Action Button */}
            <ActionButton
              title={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={isSignUp ? handleSignUp : handleLogin}
              gradient
              gradientColors={['#3b82f6', '#1d4ed8']}
              size="lg"
              disabled={loading}
              className="mb-4"
            />

            {/* Toggle Sign Up/Sign In */}
            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              className="items-center py-2"
            >
              <Text className="text-blue-600 dark:text-blue-400 font-medium">
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features Preview */}
          <View className="mt-8">
            <Text className="text-blue-100 text-center mb-4 font-medium">
              What you'll get:
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl mb-1">🎯</Text>
                <Text className="text-blue-100 text-xs text-center">Focus Sessions</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">📝</Text>
                <Text className="text-blue-100 text-xs text-center">Journaling</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">🎮</Text>
                <Text className="text-blue-100 text-xs text-center">Mini Games</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">🏆</Text>
                <Text className="text-blue-100 text-xs text-center">Rewards</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
