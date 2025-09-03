import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  BackHandler 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming 
} from 'react-native-reanimated';
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
      { id: 1, title: 'Rain Sounds', duration: '2:45', file: 'rain.mp3' },
      { id: 2, title: 'Forest Ambience', duration: '3:20', file: 'forest.mp3' },
      { id: 3, title: 'Ocean Waves', duration: '4:15', file: 'ocean.mp3' },
      { id: 4, title: 'Thunderstorm', duration: '3:50', file: 'thunder.mp3' },
      { id: 5, title: 'Birds Chirping', duration: '2:30', file: 'birds.mp3' },
      { id: 6, title: 'Wind Through Trees', duration: '3:10', file: 'wind.mp3' },
    ]
  },
  {
    id: 'ambient',
    title: 'Ambient',
    icon: '🌌',
    color: ['#8b5cf6', '#7c3aed'],
    tracks: [
      { id: 7, title: 'Space Ambience', duration: '4:00', file: 'space.mp3' },
      { id: 8, title: 'City Sounds', duration: '3:30', file: 'city.mp3' },
      { id: 9, title: 'Cafe Ambience', duration: '2:45', file: 'cafe.mp3' },
      { id: 10, title: 'Library Sounds', duration: '3:15', file: 'library.mp3' },
      { id: 11, title: 'Fireplace', duration: '4:20', file: 'fireplace.mp3' },
      { id: 12, title: 'Train Journey', duration: '3:45', file: 'train.mp3' },
    ]
  },
  {
    id: 'focus',
    title: 'Focus',
    icon: '🎯',
    color: ['#3b82f6', '#1d4ed8'],
    tracks: [
      { id: 13, title: 'Binaural Beats', duration: '5:00', file: 'binaural.mp3' },
      { id: 14, title: 'Classical Piano', duration: '4:30', file: 'piano.mp3' },
      { id: 15, title: 'Lo-fi Hip Hop', duration: '3:20', file: 'lofi.mp3' },
      { id: 16, title: 'White Noise', duration: '4:00', file: 'whitenoise.mp3' },
      { id: 17, title: 'Brown Noise', duration: '4:00', file: 'brownnoise.mp3' },
      { id: 18, title: 'Pink Noise', duration: '4:00', file: 'pinknoise.mp3' },
    ]
  },
  {
    id: 'relax',
    title: 'Relaxation',
    icon: '🧘',
    color: ['#f59e0b', '#d97706'],
    tracks: [
      { id: 19, title: 'Meditation Bell', duration: '3:00', file: 'meditation.mp3' },
      { id: 20, title: 'Spa Music', duration: '4:15', file: 'spa.mp3' },
      { id: 21, title: 'Zen Garden', duration: '3:45', file: 'zen.mp3' },
      { id: 22, title: 'Singing Bowls', duration: '4:30', file: 'bowls.mp3' },
      { id: 23, title: 'Flute Meditation', duration: '3:20', file: 'flute.mp3' },
      { id: 24, title: 'Chimes', duration: '2:50', file: 'chimes.mp3' },
    ]
  }
];

export default function MusicScreen() {
  const { state, actions } = useApp();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const soundRef = useRef(null);
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    // Set up audio mode for background playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Set up keyboard shortcuts
    const handleKeyPress = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        togglePlayPause();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        seekBackward();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        seekForward();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        stopMusic();
      }
    };

    // Add keyboard event listeners (web only)
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeyPress);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    // Update progress animation
    if (duration > 0) {
      progressAnim.value = withTiming((currentTime / duration) * 100, { duration: 100 });
    }
  }, [currentTime, duration]);

  const loadTrack = async (track) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // For demo purposes, we'll use a placeholder sound
      // In a real app, you'd load the actual audio file
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }, // Placeholder
        { 
          shouldPlay: false,
          volume: volume,
          isLooping: false,
        }
      );

      soundRef.current = sound;
      setCurrentTrack(track);
      setDuration(parseFloat(track.duration.split(':')[0]) * 60 + parseFloat(track.duration.split(':')[1]));
      
      // Set up status update listener
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis / 1000);
          setIsPlaying(status.isPlaying);
        }
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error loading track:', error);
      Alert.alert('Error', 'Could not load the selected track');
    }
  };

  const togglePlayPause = async () => {
    try {
      if (!soundRef.current) return;

      if (isPlaying) {
      await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const stopMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        setCurrentTime(0);
        setIsPlaying(false);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error stopping music:', error);
    }
  };

  const seekForward = async () => {
    try {
      if (soundRef.current && duration > 0) {
        const newPosition = Math.min(currentTime + 10, duration);
        await soundRef.current.setPositionAsync(newPosition * 1000);
      }
    } catch (error) {
      console.error('Error seeking forward:', error);
    }
  };

  const seekBackward = async () => {
    try {
      if (soundRef.current) {
        const newPosition = Math.max(currentTime - 10, 0);
        await soundRef.current.setPositionAsync(newPosition * 1000);
      }
    } catch (error) {
      console.error('Error seeking backward:', error);
    }
  };

  const changeVolume = async (newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(newVolume);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
    };
  });

  if (selectedCategory) {
    const category = musicCategories.find(cat => cat.id === selectedCategory);
    
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <LinearGradient
          colors={category.color}
          className="px-6 pt-12 pb-8"
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">
              {category.title}
            </Text>
            <View className="w-6" />
          </View>
        </LinearGradient>

        <ScrollView className="flex-1 px-6">
          <View className="py-6">
            {category.tracks.map((track) => (
              <TouchableOpacity
                key={track.id}
                onPress={() => loadTrack(track)}
                className={`mb-3 p-4 rounded-xl ${
                  currentTrack?.id === track.id
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'bg-white dark:bg-gray-800'
                } shadow-sm`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`font-semibold ${
                      currentTrack?.id === track.id
                        ? 'text-blue-800 dark:text-blue-200'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {track.title}
                    </Text>
                    <Text className={`text-sm ${
                      currentTrack?.id === track.id
                        ? 'text-blue-600 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {track.duration}
                    </Text>
                  </View>
                  {currentTrack?.id === track.id && isPlaying && (
                    <View className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              Music & Relax 🎵
            </Text>
            <Text className="text-purple-100 text-sm">
              Background music for focus and relaxation
            </Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <Text className="text-white text-sm">🔊</Text>
            <View className="w-20 bg-white/20 rounded-full h-1">
              <View 
                className="bg-white h-1 rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6">
        {/* Music Categories */}
        <View className="py-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Categories
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            {musicCategories.map((category) => (
              <Card
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                gradient
                gradientColors={category.color}
                className="w-[48%] mb-4"
              >
                <View className="p-6 items-center">
                  <Text className="text-4xl mb-3">{category.icon}</Text>
                  <Text className="text-white font-bold text-lg mb-1">
                    {category.title}
                  </Text>
                  <Text className="text-white/80 text-sm text-center">
                    {category.tracks.length} tracks
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Now Playing */}
        {currentTrack && (
          <Card className="mb-6">
            <View className="p-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎵 Now Playing
              </Text>
              
              <View className="items-center mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {currentTrack.title}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  {currentTrack.duration}
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="mb-6">
                <View className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <Animated.View 
                    style={progressAnimatedStyle}
                    className="bg-purple-500 h-2 rounded-full"
                  />
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(currentTime)}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(duration)}
                  </Text>
                </View>
              </View>

              {/* Controls */}
              <View className="flex-row justify-center items-center space-x-6">
                <TouchableOpacity
                  onPress={seekBackward}
                  className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center"
                >
                  <Ionicons name="play-skip-back" size={24} color="#6b7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={togglePlayPause}
                  className="w-16 h-16 bg-purple-500 rounded-full items-center justify-center shadow-lg"
                >
                  <Ionicons 
                    name={isPlaying ? "pause" : "play"} 
                    size={32} 
                    color="white" 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={seekForward}
                  className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center"
                >
                  <Ionicons name="play-skip-forward" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Stop Button */}
              <View className="mt-4">
                <ActionButton
                  title="Stop"
                  onPress={stopMusic}
                  variant="outline"
                  className="w-full"
                />
              </View>
            </View>
          </Card>
        )}

        {/* Keyboard Shortcuts Info */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⌨️ Keyboard Shortcuts
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Space</Text>
                <Text className="text-gray-900 dark:text-white font-medium">Play/Pause</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">← →</Text>
                <Text className="text-gray-900 dark:text-white font-medium">Seek 10s</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Esc</Text>
                <Text className="text-gray-900 dark:text-white font-medium">Stop</Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}