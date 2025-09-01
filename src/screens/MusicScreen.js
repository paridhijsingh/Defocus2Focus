import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MusicScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('lofi');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const musicCategories = [
    {
      id: 'lofi',
      title: 'Lo-Fi',
      subtitle: 'Chill beats to study/relax',
      icon: 'musical-notes',
      color: '#8b5cf6',
      tracks: [
        { id: 'lofi1', name: 'Chill Vibes', duration: '3:45' },
        { id: 'lofi2', name: 'Study Session', duration: '4:20' },
        { id: 'lofi3', name: 'Late Night', duration: '3:15' },
        { id: 'lofi4', name: 'Coffee Shop', duration: '4:05' },
      ],
    },
    {
      id: 'nature',
      title: 'Nature Sounds',
      subtitle: 'Forest, rain, ocean waves',
      icon: 'leaf',
      color: '#10b981',
      tracks: [
        { id: 'nature1', name: 'Forest Ambience', duration: '5:30' },
        { id: 'nature2', name: 'Ocean Waves', duration: '4:45' },
        { id: 'nature3', name: 'Rain Sounds', duration: '6:15' },
        { id: 'nature4', name: 'Birds Chirping', duration: '3:50' },
      ],
    },
    {
      id: 'relaxing',
      title: 'Relaxing Music',
      subtitle: 'Piano, ambient, meditation',
      icon: 'heart',
      color: '#ef4444',
      tracks: [
        { id: 'relax1', name: 'Piano Dreams', duration: '4:10' },
        { id: 'relax2', name: 'Meditation Flow', duration: '5:25' },
        { id: 'relax3', name: 'Ambient Space', duration: '6:40' },
        { id: 'relax4', name: 'Peaceful Mind', duration: '4:55' },
      ],
    },
    {
      id: 'focus',
      title: 'Focus Music',
      subtitle: 'Productivity and concentration',
      icon: 'brain',
      color: '#6366f1',
      tracks: [
        { id: 'focus1', name: 'Deep Focus', duration: '4:30' },
        { id: 'focus2', name: 'Productivity Flow', duration: '5:15' },
        { id: 'focus3', name: 'Concentration', duration: '4:45' },
        { id: 'focus4', name: 'Work Mode', duration: '5:50' },
      ],
    },
  ];

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const getCurrentCategory = () => {
    return musicCategories.find(cat => cat.id === selectedCategory);
  };

  const renderTrack = (track) => {
    const isCurrentTrack = currentTrack?.id === track.id;
    const isPlayingTrack = isCurrentTrack && isPlaying;

    return (
      <TouchableOpacity
        key={track.id}
        style={[
          styles.trackItem,
          isCurrentTrack && styles.currentTrackItem,
        ]}
        onPress={() => handlePlayTrack(track)}
      >
        <View style={styles.trackInfo}>
          <View style={styles.trackHeader}>
            <Text style={[
              styles.trackName,
              isCurrentTrack && styles.currentTrackName,
            ]}>
              {track.name}
            </Text>
            <Text style={styles.trackDuration}>{track.duration}</Text>
          </View>
          <View style={styles.trackControls}>
            <TouchableOpacity
              style={[styles.playButton, isPlayingTrack && styles.pauseButton]}
              onPress={() => handlePlayTrack(track)}
            >
              <Ionicons
                name={isPlayingTrack ? 'pause' : 'play'}
                size={16}
                color="#ffffff"
              />
            </TouchableOpacity>
            {isCurrentTrack && (
              <View style={styles.volumeControl}>
                <Ionicons name="volume-low" size={16} color="#6b7280" />
                <View style={styles.volumeSlider}>
                  <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
                </View>
                <Ionicons name="volume-high" size={16} color="#6b7280" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Music & Relaxation</Text>
          <Text style={styles.subtitle}>
            Choose your perfect background sound
          </Text>
        </View>

        {/* Category Selector */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {musicCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.selectedCategoryCard,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <LinearGradient
                  colors={[
                    category.color,
                    `${category.color}dd`,
                  ]}
                  style={[
                    styles.categoryGradient,
                    selectedCategory === category.id && styles.selectedCategoryGradient,
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={32}
                    color="#ffffff"
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Current Track Display */}
        {currentTrack && (
          <View style={styles.currentTrackSection}>
            <Text style={styles.sectionTitle}>Now Playing</Text>
            <View style={styles.currentTrackCard}>
              <View style={styles.currentTrackInfo}>
                <Text style={styles.currentTrackName}>{currentTrack.name}</Text>
                <Text style={styles.currentTrackCategory}>
                  {getCurrentCategory()?.title}
                </Text>
              </View>
              <View style={styles.currentTrackControls}>
                <TouchableOpacity
                  style={styles.mainPlayButton}
                  onPress={() => setIsPlaying(!isPlaying)}
                >
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={24}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Tracks List */}
        <View style={styles.tracksSection}>
          <Text style={styles.sectionTitle}>
            {getCurrentCategory()?.title} Tracks
          </Text>
          <View style={styles.tracksList}>
            {getCurrentCategory()?.tracks.map(renderTrack)}
          </View>
        </View>

        {/* Volume Control */}
        {currentTrack && (
          <View style={styles.volumeSection}>
            <Text style={styles.sectionTitle}>Volume</Text>
            <View style={styles.volumeContainer}>
              <Ionicons name="volume-low" size={20} color="#6b7280" />
              <View style={styles.volumeSliderContainer}>
                <TouchableOpacity
                  style={styles.volumeSlider}
                  onPress={(event) => {
                    // In a real app, you'd calculate the volume based on touch position
                    const newVolume = Math.random(); // Placeholder
                    handleVolumeChange(newVolume);
                  }}
                >
                  <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
                </TouchableOpacity>
              </View>
              <Ionicons name="volume-high" size={20} color="#6b7280" />
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.stopButton]}
              onPress={() => {
                setIsPlaying(false);
                setCurrentTrack(null);
              }}
            >
              <Ionicons name="stop" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Stop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.shuffleButton]}
              onPress={() => {
                const category = getCurrentCategory();
                const randomTrack = category.tracks[Math.floor(Math.random() * category.tracks.length)];
                setCurrentTrack(randomTrack);
                setIsPlaying(true);
              }}
            >
              <Ionicons name="shuffle" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Shuffle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Break')}
          >
            <Text style={styles.navButtonText}>Break Activities</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  categorySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoryScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedCategoryCard: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    padding: 20,
    alignItems: 'center',
  },
  selectedCategoryGradient: {
    opacity: 1,
  },
  categoryIcon: {
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  currentTrackSection: {
    marginBottom: 30,
  },
  currentTrackCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentTrackInfo: {
    flex: 1,
  },
  currentTrackName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  currentTrackCategory: {
    fontSize: 14,
    color: '#6b7280',
  },
  currentTrackControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tracksSection: {
    marginBottom: 30,
  },
  tracksList: {
    gap: 12,
  },
  trackItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentTrackItem: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  trackInfo: {
    flex: 1,
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  currentTrackName: {
    color: '#6366f1',
  },
  trackDuration: {
    fontSize: 14,
    color: '#6b7280',
  },
  trackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volumeSlider: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    position: 'relative',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  volumeSection: {
    marginBottom: 30,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  volumeSliderContainer: {
    flex: 1,
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  shuffleButton: {
    backgroundColor: '#8b5cf6',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navigationSection: {
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MusicScreen;
