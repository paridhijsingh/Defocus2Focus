/**
 * Audio Manager for Defocus2Focus Web App
 * Manages organized audio files in category-based folder structure
 */

class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentTrack = null;
    this.currentCategory = null;
    
    // Audio sources - organized by category folders
    this.audioSources = {
      nature: {
        rain: "./assets/audio/nature/rain.mp3",
        forest: "./assets/audio/nature/forest.mp3",
        ocean: "./assets/audio/nature/ocean.mp3",
        thunder: "./assets/audio/nature/thunder.mp3",
        birds: "./assets/audio/nature/birds.mp3",
        wind: "./assets/audio/nature/wind.mp3",
      },
      ambient: {
        space: "./assets/audio/ambient/space.mp3",
        city: "./assets/audio/ambient/city.mp3",
        cafe: "./assets/audio/ambient/cafe.mp3",
        library: "./assets/audio/ambient/library.mp3",
        fireplace: "./assets/audio/ambient/fireplace.mp3",
        train: "./assets/audio/ambient/train.mp3",
      },
      focus: {
        binaural: "./assets/audio/focus/binaural.mp3",
        classical: "./assets/audio/focus/classical.mp3",
        lofi: "./assets/audio/focus/lofi.mp3",
        piano: "./assets/audio/focus/piano.mp3",
        "white-noise": "./assets/audio/focus/white_noise.mp3",
        "brown-noise": "./assets/audio/focus/brown_noise.mp3",
      },
      relax: {
        meditation: "./assets/audio/relax/meditation.mp3",
        spa: "./assets/audio/relax/spa.mp3",
        zen: "./assets/audio/relax/zen.mp3",
        chimes: "./assets/audio/relax/chimes.mp3",
        "singing-bowls": "./assets/audio/relax/singing_bowls.mp3",
        flute: "./assets/audio/relax/flute.mp3",
      },
    };
    
    this.initializeAudio();
  }

  /**
   * Initialize audio system
   */
  initializeAudio() {
    console.log("🎵 Audio Manager initialized with organized folder structure");
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
        console.log(`🎵 Audio loaded successfully: ${category}/${sound}`);
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
      this.currentAudio.play()
        .then(() => {
          this.isPlaying = true;
          console.log("🎵 Audio resumed");
        })
        .catch(error => {
          console.error("🎵 Error resuming audio:", error);
        });
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
      console.log(`🎵 Volume set to: ${(this.volume * 100).toFixed(0)}%`);
    }
    this.saveAudioPreferences();
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

  /**
   * Check if audio file exists
   * @param {string} category - Audio category
   * @param {string} sound - Sound name
   * @returns {boolean} True if audio file exists
   */
  hasAudio(category, sound) {
    return !!(this.audioSources[category] && this.audioSources[category][sound]);
  }
}

// Create global audio manager instance
window.audioManager = new AudioManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}
