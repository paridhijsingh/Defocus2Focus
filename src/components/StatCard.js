import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  gradient = false, 
  gradientColors = ['#3b82f6', '#1d4ed8'],
  className = '',
  textColor = 'text-white'
}) {
  const CardContent = () => (
    <View className={`p-4 rounded-xl ${className}`}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`text-2xl ${textColor}`}>{icon}</Text>
        <Text className={`text-lg font-bold ${textColor}`}>{value}</Text>
      </View>
      <Text className={`text-sm ${textColor} opacity-90`}>{title}</Text>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        className="rounded-xl shadow-sm"
      >
        <CardContent />
      </LinearGradient>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <CardContent />
    </View>
  );
}
