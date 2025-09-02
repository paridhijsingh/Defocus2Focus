/**
 * Audio Manager for Defocus2Focus Web App
 * Manages local audio files and provides centralized audio control
 */

class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentTrack = null;
    this.currentCategory = null;
    
    // Audio sources - local files in assets/audio/
    this.audioSources = {
      nature: {
        rain: "./assets/audio/rain.mp3",           // Gentle rain sounds
        forest: "./assets/audio/forest.mp3",       // Forest ambiance with birds
        ocean: "./assets/audio/ocean.mp3",         // Ocean waves
        thunder: "./assets/audio/thunder.mp3",     // Distant thunder
        birds: "./assets/audio/birds.mp3",         // Bird songs
        wind: "./assets/audio/wind.mp3",           // Wind through trees
      },
      ambient: {
        space: "./assets/audio/space.mp3",         // Space ambient sounds
        city: "./assets/audio/city.mp3",           // City ambiance
        cafe: "./assets/audio/cafe.mp3",           // Café background noise
        library: "./assets/audio/library.mp3",     // Quiet library sounds
        fireplace: "./assets/audio/fireplace.mp3", // Fireplace crackling
        train: "./assets/audio/train.mp3",         // Train journey sounds
      },
      focus: {
        binaural: "./assets/audio/binaural.mp3",   // Binaural beats for focus
        classical: "./assets/audio/classical.mp3", // Classical music
        lofi: "./assets/audio/lofi.mp3",           // Lo-fi hip hop
        piano: "./assets/audio/piano.mp3",         // Piano melodies
        "white-noise": "./assets/audio/white-noise.mp3", // White noise
        "brown-noise": "./assets/audio/brown-noise.mp3", // Brown noise
      },
      relax: {
        meditation: "./assets/audio/meditation.mp3",     // Meditation sounds
        spa: "./assets/audio/spa.mp3",                   // Spa ambiance
        zen: "./assets/audio/zen.mp3",                   // Zen garden sounds
        chimes: "./assets/audio/chimes.mp3",             // Wind chimes
        "singing-bowls": "./assets/audio/singing-bowls.mp3", // Singing bowls
        flute: "./assets/audio/flute.mp3",               // Flute music
      },
    };
    
    this.initializeAudio();
  }

  /**
   * Initialize audio system
   */
  initializeAudio() {
    console.log("🎵 Audio Manager initialized");
    this.loadAudioPreferences();
  }

  /**
   * Load saved audio preferences from localStorage
   */
  loadAudioPreferences() {
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
    }
    
    const savedTrack = localStorage.getItem('currentAudioTrack');
    const savedCategory = localStorage.getItem('currentAudioCategory');
    if (savedTrack && savedCategory) {
      this.currentTrack = savedTrack;
      this.currentCategory = savedCategory;
    }
  }

  /**
   * Save audio preferences to localStorage
   */
  saveAudioPreferences() {
    localStorage.setItem('audioVolume', this.volume.toString());
    if (this.currentTrack) localStorage.setItem('currentAudioTrack', this.currentTrack);
    if (this.currentCategory) localStorage.setItem('currentAudioCategory', this.currentCategory);
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
      
      // Get audio file path
      const audioPath = this.getAudioPath(category, sound);
      if (!audioPath) {
        console.error(`🎵 Audio not found: ${category}/${sound}`);
        return false;
      }
      
      // Create new audio element
      this.currentAudio = new Audio(audioPath);
      this.currentAudio.volume = this.volume;
      this.currentAudio.loop = true; // Loop the audio
      
      // Set current track info
      this.currentTrack = sound;
      this.currentCategory = category;
      
      // Set up event listeners
      this.currentAudio.addEventListener('loadeddata', () => {
        console.log(`🎵 Audio loaded: ${category}/${sound}`);
      });
      
      this.currentAudio.addEventListener('error', (e) => {
        console.error(`🎵 Audio error: ${category}/${sound}`, e);
        // Fallback to generated audio
        this.playGeneratedAudio(category, sound);
      });
      
      this.currentAudio.addEventListener('ended', () => {
        console.log(`🎵 Audio ended: ${category}/${sound}`);
      });
      
      // Play the audio
      await this.currentAudio.play();
      this.isPlaying = true;
      this.saveAudioPreferences();
      
      console.log(`🎵 Successfully playing: ${category}/${sound}`);
      return true;
      
    } catch (error) {
      console.error(`🎵 Play error: ${category}/${sound}`, error);
      // Fallback to generated audio
      this.playGeneratedAudio(category, sound);
      return false;
    }
  }

  /**
   * Get audio file path for category and sound
   * @param {string} category - Audio category
   * @param {string} sound - Sound name
   * @returns {string|null} Audio file path or null if not found
   */
  getAudioPath(category, sound) {
    if (this.audioSources[category] && this.audioSources[category][sound]) {
      return this.audioSources[category][sound];
    }
    return null;
  }

  /**
   * Fallback to generated audio when local files fail
   * @param {string} category - Audio category
   * @param {string} sound - Sound name
   */
  playGeneratedAudio(category, sound) {
    console.log(`🎵 Using generated audio fallback: ${category}/${sound}`);
    // This would call your existing generateFallbackAudio function
    if (typeof generateFallbackAudio === 'function') {
      generateFallbackAudio(sound, category);
    }
  }

  /**
   * Pause current audio
   */
  pauseAudio() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
      console.log("🎵 Audio paused");
    }
  }

  /**
   * Resume current audio
   */
  resumeAudio() {
    if (this.currentAudio && !this.isPlaying) {
      this.currentAudio.play();
      this.isPlaying = true;
      console.log("🎵 Audio resumed");
    }
  }

  /**
   * Stop current audio
   */
  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
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
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
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
      isPlaying: this.isPlaying
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

// Create global audio manager instance
window.audioManager = new AudioManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}
