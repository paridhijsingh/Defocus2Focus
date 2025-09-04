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

const musicCategories = [
  {
    id: 'nature',
    title: 'Nature Sounds',
    icon: '🌿',
    color: ['#10b981', '#059669'],
    tracks: [
      { id: '1', name: 'Forest Rain', duration: '10:00', emoji: '🌧️' },
      { id: '2', name: 'Ocean Waves', duration: '15:00', emoji: '🌊' },
      { id: '3', name: 'Birds Chirping', duration: '8:00', emoji: '🐦' },
      { id: '4', name: 'Mountain Wind', duration: '12:00', emoji: '🏔️' },
    ]
  },
  {
    id: 'ambient',
    title: 'Ambient',
    icon: '🎵',
    color: ['#8b5cf6', '#7c3aed'],
    tracks: [
      { id: '5', name: 'Deep Space', duration: '20:00', emoji: '🌌' },
      { id: '6', name: 'Cosmic Drift', duration: '18:00', emoji: '✨' },
      { id: '7', name: 'Ethereal Dreams', duration: '25:00', emoji: '💫' },
    ]
  },
  {
    id: 'focus',
    title: 'Focus Music',
    icon: '🎯',
    color: ['#3b82f6', '#1d4ed8'],
    tracks: [
      { id: '8', name: 'Concentration Flow', duration: '30:00', emoji: '🧠' },
      { id: '9', name: 'Deep Work', duration: '45:00', emoji: '💻' },
      { id: '10', name: 'Study Session', duration: '60:00', emoji: '📚' },
    ]
  },
  {
    id: 'relax',
    title: 'Relaxation',
    icon: '🧘',
    color: ['#f59e0b', '#d97706'],
    tracks: [
      { id: '11', name: 'Meditation Bells', duration: '15:00', emoji: '🔔' },
      { id: '12', name: 'Peaceful Piano', duration: '22:00', emoji: '🎹' },
      { id: '13', name: 'Zen Garden', duration: '18:00', emoji: '🏯' },
    ]
  }
];

export default function MusicScreen() {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('nature');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePauseTrack = () => {
    setIsPlaying(false);
  };

  const handleStopTrack = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const renderTrackItem = ({ item }) => (
    <Card className="mb-3">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text className="text-2xl mr-3">{item.emoji}</Text>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {item.duration}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => currentTrack?.id === item.id ? handlePauseTrack() : handlePlayTrack(item)}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              currentTrack?.id === item.id && isPlaying
                ? 'bg-orange-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Ionicons 
              name={currentTrack?.id === item.id && isPlaying ? 'pause' : 'play'} 
              size={20} 
              color={currentTrack?.id === item.id && isPlaying ? 'white' : '#6b7280'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

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
              🎵 Music & Relax
            </Text>
            <Text className="text-purple-100 text-sm">
              Focus, relax, and unwind
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-2">
            <Ionicons name="musical-notes-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Now Playing */}
        {currentTrack && (
          <Card className="mb-4">
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-3xl mr-3">{currentTrack.emoji}</Text>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentTrack.name}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {currentTrack.duration}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={isPlaying ? handlePauseTrack : () => handlePlayTrack(currentTrack)}
                    className="w-12 h-12 bg-purple-500 rounded-full items-center justify-center mr-2"
                  >
                    <Ionicons 
                      name={isPlaying ? 'pause' : 'play'} 
                      size={20} 
                      color="white" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleStopTrack}
                    className="w-12 h-12 bg-gray-500 rounded-full items-center justify-center"
                  >
                    <Ionicons name="stop" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        )}
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-4">
        {/* Category Selection */}
        <View className="flex-row mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {musicCategories.map((category) => (
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

        {/* Selected Category Tracks */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {musicCategories.find(cat => cat.id === selectedCategory)?.title}
          </Text>
          
          <FlatList
            data={musicCategories.find(cat => cat.id === selectedCategory)?.tracks || []}
            renderItem={renderTrackItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Quick Actions */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎧 Quick Actions
            </Text>
            <View className="flex-row flex-wrap">
              <ActionButton
                title="Play All"
                onPress={() => {
                  const firstTrack = musicCategories.find(cat => cat.id === selectedCategory)?.tracks[0];
                  if (firstTrack) handlePlayTrack(firstTrack);
                }}
                variant="secondary"
                size="sm"
                className="mr-2 mb-2"
              />
              <ActionButton
                title="Shuffle"
                onPress={() => {
                  const tracks = musicCategories.find(cat => cat.id === selectedCategory)?.tracks || [];
                  const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
                  if (randomTrack) handlePlayTrack(randomTrack);
                }}
                variant="secondary"
                size="sm"
                className="mr-2 mb-2"
              />
              <ActionButton
                title="Stop All"
                onPress={handleStopTrack}
                variant="outline"
                size="sm"
                className="mr-2 mb-2"
              />
            </View>
          </View>
        </Card>

        {/* Benefits */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎯 Why Music Helps
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Text className="text-purple-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Nature Sounds:</Text> Reduce stress and improve focus
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-purple-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Ambient Music:</Text> Enhance creativity and deep thinking
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-purple-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Focus Music:</Text> Improve concentration and productivity
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-purple-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Relaxation:</Text> Promote mindfulness and calm
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
