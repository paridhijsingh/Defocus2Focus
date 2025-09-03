import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Dashboard from './components/Dashboard';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [username] = useState('Paridhi'); // You can get this from context or props

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <Dashboard 
            username={username} 
            setCurrentScreen={setCurrentScreen} 
          />
        );
      case 'journal':
        return (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Journal Screen
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Coming soon...
            </Text>
          </View>
        );
      case 'games':
        return (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Games Screen
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Coming soon...
            </Text>
          </View>
        );
      case 'aiTherapist':
        return (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Therapist Screen
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Coming soon...
            </Text>
          </View>
        );
      case 'leaderboard':
        return (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Leaderboard Screen
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Coming soon...
            </Text>
          </View>
        );
      case 'history':
        return (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              History Screen
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Coming soon...
            </Text>
          </View>
        );
      case 'defocus':
        return (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Defocus Session
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Starting your focus session...
            </Text>
          </View>
        );
      case 'challenge':
        return (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Challenge Friends
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Coming soon...
            </Text>
          </View>
        );
      default:
        return (
          <Dashboard 
            username={username} 
            setCurrentScreen={setCurrentScreen} 
          />
        );
    }
  };

  return (
    <View className="flex-1">
      {renderCurrentScreen()}
    </View>
  );
};

export default App;