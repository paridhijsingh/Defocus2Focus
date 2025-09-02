# React Native Audio System for Defocus2Focus

This document provides a complete implementation of a local audio system for React Native, as requested.

## 1. Installation

First, install the required dependencies:

```bash
npm install react-native-sound
# For iOS
cd ios && pod install && cd ..
```

## 2. Audio Manager Implementation

Create `src/services/AudioManager.js`:

```javascript
import Sound from "react-native-sound";

/**
 * Audio Manager for Defocus2Focus React Native App
 * Manages local audio files and provides centralized audio control
 */
class AudioManager {
  constructor() {
    this.currentSound = null;
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentTrack = null;
    this.currentCategory = null;

    // Audio sources - local files in assets/audio/
    this.audioSources = {
      nature: {
        rain: require("../assets/audio/rain.mp3"), // Gentle rain sounds
        forest: require("../assets/audio/forest.mp3"), // Forest ambiance with birds
        ocean: require("../assets/audio/ocean.mp3"), // Ocean waves
        thunder: require("../assets/audio/thunder.mp3"), // Distant thunder
        birds: require("../assets/audio/birds.mp3"), // Bird songs
        wind: require("../assets/audio/wind.mp3"), // Wind through trees
      },
      ambient: {
        space: require("../assets/audio/space.mp3"), // Space ambient sounds
        city: require("../assets/audio/city.mp3"), // City ambiance
        cafe: require("../assets/audio/cafe.mp3"), // Café background noise
        library: require("../assets/audio/library.mp3"), // Quiet library sounds
        fireplace: require("../assets/audio/fireplace.mp3"), // Fireplace crackling
        train: require("../assets/audio/train.mp3"), // Train journey sounds
      },
      focus: {
        binaural: require("../assets/audio/binaural.mp3"), // Binaural beats for focus
        classical: require("../assets/audio/classical.mp3"), // Classical music
        lofi: require("../assets/audio/lofi.mp3"), // Lo-fi hip hop
        piano: require("../assets/audio/piano.mp3"), // Piano melodies
        "white-noise": require("../assets/audio/white-noise.mp3"), // White noise
        "brown-noise": require("../assets/audio/brown-noise.mp3"), // Brown noise
      },
      relax: {
        meditation: require("../assets/audio/meditation.mp3"), // Meditation sounds
        spa: require("../assets/audio/spa.mp3"), // Spa ambiance
        zen: require("../assets/audio/zen.mp3"), // Zen garden sounds
        chimes: require("../assets/audio/chimes.mp3"), // Wind chimes
        "singing-bowls": require("../assets/audio/singing-bowls.mp3"), // Singing bowls
        flute: require("../assets/audio/flute.mp3"), // Flute music
      },
    };

    this.initializeAudio();
  }

  /**
   * Initialize audio system
   */
  initializeAudio() {
    console.log("🎵 Audio Manager initialized");
    // Enable playback in silence mode
    Sound.setCategory("Playback");
    this.loadAudioPreferences();
  }

  /**
   * Load saved audio preferences from AsyncStorage
   */
  async loadAudioPreferences() {
    try {
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      const savedVolume = await AsyncStorage.getItem("audioVolume");
      if (savedVolume) {
        this.volume = parseFloat(savedVolume);
      }

      const savedTrack = await AsyncStorage.getItem("currentAudioTrack");
      const savedCategory = await AsyncStorage.getItem("currentAudioCategory");
      if (savedTrack && savedCategory) {
        this.currentTrack = savedTrack;
        this.currentCategory = savedCategory;
      }
    } catch (error) {
      console.error("Error loading audio preferences:", error);
    }
  }

  /**
   * Save audio preferences to AsyncStorage
   */
  async saveAudioPreferences() {
    try {
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      await AsyncStorage.setItem("audioVolume", this.volume.toString());
      if (this.currentTrack)
        await AsyncStorage.setItem("currentAudioTrack", this.currentTrack);
      if (this.currentCategory)
        await AsyncStorage.setItem(
          "currentAudioCategory",
          this.currentCategory
        );
    } catch (error) {
      console.error("Error saving audio preferences:", error);
    }
  }

  /**
   * Play audio from specific category and sound
   * @param {string} category - Audio category (nature, ambient, focus, relax)
   * @param {string} sound - Sound name (rain, forest, ocean, etc.)
   */
  async playAudio(category, sound) {
    try {
      console.log(`🎵 Playing audio: ${category}/${sound}`);

      // Stop current audio if playing
      this.stopAudio();

      // Get audio file
      const audioFile = this.getAudioFile(category, sound);
      if (!audioFile) {
        console.error(`🎵 Audio not found: ${category}/${sound}`);
        return false;
      }

      // Create new sound instance
      this.currentSound = new Sound(audioFile, (error) => {
        if (error) {
          console.error(`🎵 Failed to load audio: ${category}/${sound}`, error);
          return;
        }

        // Set volume and loop
        this.currentSound.setVolume(this.volume);
        this.currentSound.setNumberOfLoops(-1); // Loop indefinitely

        // Play the audio
        this.currentSound.play((success) => {
          if (success) {
            console.log(`🎵 Successfully playing: ${category}/${sound}`);
            this.isPlaying = true;
            this.currentTrack = sound;
            this.currentCategory = category;
            this.saveAudioPreferences();
          } else {
            console.error(`🎵 Failed to play audio: ${category}/${sound}`);
          }
        });
      });

      return true;
    } catch (error) {
      console.error(`🎵 Play error: ${category}/${sound}`, error);
      return false;
    }
  }

  /**
   * Get audio file for category and sound
   * @param {string} category - Audio category
   * @param {string} sound - Sound name
   * @returns {any} Audio file or null if not found
   */
  getAudioFile(category, sound) {
    if (this.audioSources[category] && this.audioSources[category][sound]) {
      return this.audioSources[category][sound];
    }
    return null;
  }

  /**
   * Pause current audio
   */
  pauseAudio() {
    if (this.currentSound && this.isPlaying) {
      this.currentSound.pause();
      this.isPlaying = false;
      console.log("🎵 Audio paused");
    }
  }

  /**
   * Resume current audio
   */
  resumeAudio() {
    if (this.currentSound && !this.isPlaying) {
      this.currentSound.play();
      this.isPlaying = true;
      console.log("🎵 Audio resumed");
    }
  }

  /**
   * Stop current audio
   */
  stopAudio() {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound.release();
      this.currentSound = null;
      this.isPlaying = false;
      this.currentTrack = null;
      this.currentCategory = null;
      console.log("🎵 Audio stopped");
    }
  }

  /**
   * Set audio volume
   * @param {number} volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentSound) {
      this.currentSound.setVolume(this.volume);
    }
    this.saveAudioPreferences();
    console.log(`🎵 Volume set to: ${this.volume}`);
  }

  /**
   * Get current volume
   * @returns {number} Current volume level
   */
  getVolume() {
    return this.volume;
  }

  /**
   * Check if audio is currently playing
   * @returns {boolean} True if audio is playing
   */
  isAudioPlaying() {
    return this.isPlaying;
  }

  /**
   * Get current track info
   * @returns {object} Current track and category info
   */
  getCurrentTrack() {
    return {
      track: this.currentTrack,
      category: this.currentCategory,
      isPlaying: this.isPlaying,
    };
  }

  /**
   * Get all available audio sources
   * @returns {object} All audio sources organized by category
   */
  getAudioSources() {
    return this.audioSources;
  }

  /**
   * Get audio sources for specific category
   * @param {string} category - Audio category
   * @returns {object|null} Audio sources for category or null if not found
   */
  getCategorySources(category) {
    return this.audioSources[category] || null;
  }
}

// Create singleton instance
const audioManager = new AudioManager();
export default audioManager;
```

## 3. Audio Context Hook

Create `src/hooks/useAudio.js`:

```javascript
import { useState, useEffect, useCallback } from "react";
import audioManager from "../services/AudioManager";

/**
 * Custom hook for audio management
 */
export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    // Initialize state from audio manager
    const trackInfo = audioManager.getCurrentTrack();
    setIsPlaying(trackInfo.isPlaying);
    setCurrentTrack(trackInfo.track);
    setCurrentCategory(trackInfo.category);
    setVolume(audioManager.getVolume());
  }, []);

  const playAudio = useCallback(async (category, sound) => {
    const success = await audioManager.playAudio(category, sound);
    if (success) {
      const trackInfo = audioManager.getCurrentTrack();
      setIsPlaying(trackInfo.isPlaying);
      setCurrentTrack(trackInfo.track);
      setCurrentCategory(trackInfo.category);
    }
    return success;
  }, []);

  const pauseAudio = useCallback(() => {
    audioManager.pauseAudio();
    setIsPlaying(false);
  }, []);

  const resumeAudio = useCallback(() => {
    audioManager.resumeAudio();
    setIsPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    audioManager.stopAudio();
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentCategory(null);
  }, []);

  const setAudioVolume = useCallback((newVolume) => {
    audioManager.setVolume(newVolume);
    setVolume(newVolume);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  }, [isPlaying, pauseAudio, resumeAudio]);

  return {
    isPlaying,
    currentTrack,
    currentCategory,
    volume,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    setAudioVolume,
    togglePlayPause,
    audioSources: audioManager.getAudioSources(),
  };
};
```

## 4. Audio Controls Component

Create `src/components/AudioControls.js`:

```javascript
import React from "react";
import { View, Text, TouchableOpacity, Slider, StyleSheet } from "react-native";
import { useAudio } from "../hooks/useAudio";

/**
 * Audio Controls Component
 * Provides play/pause/stop and volume controls
 */
const AudioControls = ({ style }) => {
  const {
    isPlaying,
    currentTrack,
    currentCategory,
    volume,
    togglePlayPause,
    stopAudio,
    setAudioVolume,
  } = useAudio();

  return (
    <View style={[styles.container, style]}>
      {/* Current Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>
          {currentTrack
            ? currentTrack.charAt(0).toUpperCase() + currentTrack.slice(1)
            : "No track selected"}
        </Text>
        <Text style={styles.trackCategory}>
          {currentCategory
            ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)
            : ""}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={togglePlayPause}
        >
          <Text style={styles.buttonText}>{isPlaying ? "⏸️" : "▶️"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={stopAudio}
        >
          <Text style={styles.buttonText}>⏹️</Text>
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      <View style={styles.volumeControl}>
        <Text style={styles.volumeLabel}>🔊</Text>
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setAudioVolume}
          minimumTrackTintColor="#667eea"
          maximumTrackTintColor="#e5e7eb"
          thumbStyle={styles.volumeThumb}
        />
        <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 15,
    margin: 10,
  },
  trackInfo: {
    alignItems: "center",
    marginBottom: 15,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 5,
  },
  trackCategory: {
    fontSize: 14,
    color: "#6b7280",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  playButton: {
    backgroundColor: "#10b981",
  },
  stopButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
  volumeControl: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  volumeLabel: {
    fontSize: 20,
    marginRight: 10,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  volumeThumb: {
    backgroundColor: "#667eea",
    width: 20,
    height: 20,
  },
  volumeValue: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 10,
    minWidth: 40,
    textAlign: "right",
  },
});

export default AudioControls;
```

## 5. Audio Track List Component

Create `src/components/AudioTrackList.js`:

```javascript
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useAudio } from "../hooks/useAudio";

/**
 * Audio Track List Component
 * Displays available audio tracks by category
 */
const AudioTrackList = ({ category, style }) => {
  const { playAudio, currentTrack, currentCategory, isPlaying } = useAudio();
  const audioSources = useAudio().audioSources;

  const tracks = audioSources[category]
    ? Object.keys(audioSources[category])
    : [];

  const renderTrack = ({ item: track }) => {
    const isCurrentTrack =
      currentTrack === track && currentCategory === category;

    return (
      <TouchableOpacity
        style={[styles.trackItem, isCurrentTrack && styles.currentTrack]}
        onPress={() => playAudio(category, track)}
      >
        <Text style={styles.trackIcon}>{getTrackIcon(category, track)}</Text>
        <Text
          style={[styles.trackName, isCurrentTrack && styles.currentTrackText]}
        >
          {track.charAt(0).toUpperCase() + track.slice(1).replace("-", " ")}
        </Text>
        {isCurrentTrack && isPlaying && (
          <Text style={styles.playingIndicator}>🔊</Text>
        )}
      </TouchableOpacity>
    );
  };

  const getTrackIcon = (category, track) => {
    const icons = {
      nature: {
        rain: "🌧️",
        forest: "🌲",
        ocean: "🌊",
        thunder: "⛈️",
        birds: "🐦",
        wind: "💨",
      },
      ambient: {
        space: "🌌",
        city: "🏙️",
        cafe: "☕",
        library: "📚",
        fireplace: "🔥",
        train: "🚂",
      },
      focus: {
        binaural: "🧠",
        classical: "🎼",
        lofi: "🎧",
        piano: "🎹",
        "white-noise": "📻",
        "brown-noise": "📡",
      },
      relax: {
        meditation: "🧘",
        spa: "🛁",
        zen: "🕯️",
        chimes: "🔔",
        "singing-bowls": "🥣",
        flute: "🎵",
      },
    };

    return icons[category]?.[track] || "🎵";
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.categoryTitle}>
        {category.charAt(0).toUpperCase() + category.slice(1)} Sounds
      </Text>
      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 15,
    textAlign: "center",
  },
  trackItem: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    margin: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  currentTrack: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  trackIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  trackName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  currentTrackText: {
    color: "#10b981",
    fontWeight: "bold",
  },
  playingIndicator: {
    position: "absolute",
    top: 5,
    right: 5,
    fontSize: 16,
  },
});

export default AudioTrackList;
```

## 6. Usage in Screens

Example usage in `src/screens/MusicScreen.js`:

```javascript
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import AudioControls from "../components/AudioControls";
import AudioTrackList from "../components/AudioTrackList";

const MusicScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("nature");

  const categories = ["nature", "ambient", "focus", "relax"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎵 Music & Relax</Text>

      {/* Audio Controls */}
      <AudioControls />

      {/* Category Selection */}
      <View style={styles.categoryTabs}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.activeCategoryTab,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category && styles.activeCategoryTabText,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Audio Track List */}
      <AudioTrackList category={selectedCategory} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
    color: "#374151",
  },
  categoryTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
  },
  activeCategoryTab: {
    borderColor: "#667eea",
    backgroundColor: "#667eea",
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeCategoryTabText: {
    color: "white",
  },
});

export default MusicScreen;
```

## 7. Helper Functions

Create `src/utils/audioHelpers.js`:

```javascript
import audioManager from "../services/AudioManager";

/**
 * Helper functions for audio management
 */

/**
 * Play audio with error handling
 * @param {string} category - Audio category
 * @param {string} sound - Sound name
 * @returns {Promise<boolean>} Success status
 */
export const playAudio = async (category, sound) => {
  try {
    return await audioManager.playAudio(category, sound);
  } catch (error) {
    console.error("Error playing audio:", error);
    return false;
  }
};

/**
 * Stop all audio
 */
export const stopAudio = () => {
  try {
    audioManager.stopAudio();
  } catch (error) {
    console.error("Error stopping audio:", error);
  }
};

/**
 * Set audio volume
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export const setAudioVolume = (volume) => {
  try {
    audioManager.setVolume(volume);
  } catch (error) {
    console.error("Error setting volume:", error);
  }
};

/**
 * Get current audio state
 * @returns {object} Current audio state
 */
export const getAudioState = () => {
  return {
    isPlaying: audioManager.isAudioPlaying(),
    currentTrack: audioManager.getCurrentTrack(),
    volume: audioManager.getVolume(),
  };
};

/**
 * Get available audio sources
 * @returns {object} All audio sources
 */
export const getAudioSources = () => {
  return audioManager.getAudioSources();
};
```

## 8. File Structure

```
src/
├── services/
│   └── AudioManager.js
├── hooks/
│   └── useAudio.js
├── components/
│   ├── AudioControls.js
│   └── AudioTrackList.js
├── screens/
│   └── MusicScreen.js
├── utils/
│   └── audioHelpers.js
└── assets/
    └── audio/
        ├── rain.mp3
        ├── forest.mp3
        ├── ocean.mp3
        ├── thunder.mp3
        ├── birds.mp3
        ├── wind.mp3
        ├── space.mp3
        ├── city.mp3
        ├── cafe.mp3
        ├── library.mp3
        ├── fireplace.mp3
        ├── train.mp3
        ├── binaural.mp3
        ├── classical.mp3
        ├── lofi.mp3
        ├── piano.mp3
        ├── white-noise.mp3
        ├── brown-noise.mp3
        ├── meditation.mp3
        ├── spa.mp3
        ├── zen.mp3
        ├── chimes.mp3
        ├── singing-bowls.mp3
        └── flute.mp3
```

## 9. Key Features

✅ **Local Audio Files**: All audio files stored locally in `assets/audio/`  
✅ **Offline Playback**: Works without internet connection  
✅ **Centralized Management**: Single AudioManager instance  
✅ **Volume Control**: Adjustable volume with persistence  
✅ **Play/Pause/Stop**: Full audio control functionality  
✅ **Category Organization**: Organized by nature, ambient, focus, relax  
✅ **State Management**: React hooks for easy integration  
✅ **Error Handling**: Graceful error handling and fallbacks  
✅ **Persistence**: Saves preferences to AsyncStorage  
✅ **Modular Design**: Reusable components and utilities

## 10. Usage Examples

```javascript
// In any component
import { useAudio } from "../hooks/useAudio";

const MyComponent = () => {
  const { playAudio, stopAudio, isPlaying } = useAudio();

  const handlePlayRain = () => {
    playAudio("nature", "rain");
  };

  return (
    <TouchableOpacity onPress={handlePlayRain}>
      <Text>Play Rain Sounds</Text>
    </TouchableOpacity>
  );
};
```

This implementation provides a complete, production-ready audio system for your React Native Defocus2Focus app with all the features you requested!
