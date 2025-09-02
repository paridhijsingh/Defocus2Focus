# 🎵 Audio System

The Defocus2Focus audio system provides therapeutic sounds and music to enhance focus, relaxation, and productivity. This system supports both web and mobile platforms with high-quality, offline-capable audio playback.

## 📁 Folder Structure

```
assets/audio/
├── nature/          # Natural environmental sounds
├── ambient/         # Ambient background sounds
├── focus/           # Music optimized for concentration
├── relax/           # Relaxation and meditation sounds
└── README.md        # This documentation
```

## 🎧 Audio Categories

### 🌿 Nature Sounds (`nature/`)

- **rain.mp3** - Gentle rainfall for relaxation
- **forest.mp3** - Forest ambience with birds
- **ocean.mp3** - Ocean waves for meditation
- **thunder.mp3** - Distant thunder for focus
- **birds.mp3** - Bird songs for morning energy
- **wind.mp3** - Wind through trees for calm

### 🌆 Ambient Sounds (`ambient/`)

- **space.mp3** - Cosmic ambient for deep focus
- **city.mp3** - Urban background for productivity
- **cafe.mp3** - Coffee shop ambience for work
- **library.mp3** - Quiet library atmosphere
- **fireplace.mp3** - Crackling fire for warmth
- **train.mp3** - Train journey for rhythm

### 🎯 Focus Music (`focus/`)

- **Binaural.mp3** - Binaural beats for concentration
- **classical.mp3** - Classical music for deep work
- **lofi.mp3** - Lo-fi hip hop for study sessions
- **piano.mp3** - Solo piano for gentle focus
- **white noise.mp3** - White noise for blocking distractions
- **brown noise.mp3** - Brown noise for deep focus

### 🧘 Relaxation Sounds (`relax/`)

- **meditation.mp3** - Guided meditation background
- **spa.mp3** - Spa ambience for relaxation
- **zen.mp3** - Zen garden sounds for peace
- **chimes.mp3** - Wind chimes for mindfulness
- **singing bowl.mp3** - Tibetan singing bowls
- **flute.mp3** - Flute music for tranquility

## 🔧 Technical Implementation

### Audio Manager (`src/utils/audio-manager.js`)

The `AudioManager` class handles all audio operations:

```javascript
// Initialize audio manager
const audioManager = new AudioManager();

// Play audio
audioManager.playAudio("nature", "rain");

// Control playback
audioManager.pauseAudio();
audioManager.resumeAudio();
audioManager.stopAudio();

// Volume control
audioManager.setVolume(0.7);
```

### Key Features

- **Offline Playback**: All audio files are local for offline functionality
- **Background Playback**: Music continues when switching between app features
- **Volume Control**: Persistent volume settings across sessions
- **Playlist Support**: Queue and manage multiple tracks
- **Fallback System**: Generated audio if files are unavailable

## 📝 Adding New Audio Files

### 1. File Requirements

- **Format**: MP3 (recommended) or WAV
- **Duration**: 3-10 minutes for loops
- **Quality**: 44.1kHz, 16-bit minimum
- **Size**: Keep under 10MB per file for performance

### 2. Adding to a Category

1. Place your audio file in the appropriate category folder:

   ```
   assets/audio/nature/your-new-sound.mp3
   ```

2. Update the `audioSources` object in `src/utils/audio-manager.js`:

   ```javascript
   nature: {
     rain: "../assets/audio/nature/rain.mp3",
     forest: "../assets/audio/nature/forest.mp3",
     "your-new-sound": "../assets/audio/nature/your-new-sound.mp3", // Add this line
   }
   ```

3. Update the track display in `public/index.html`:
   ```javascript
   const natureTracks = [
     { id: "rain", name: "Rain", icon: "🌧️" },
     { id: "forest", name: "Forest", icon: "🌲" },
     { id: "your-new-sound", name: "Your New Sound", icon: "🎵" }, // Add this line
   ];
   ```

### 3. Creating a New Category

1. Create a new folder:

   ```bash
   mkdir assets/audio/your-category
   ```

2. Add audio files to the folder

3. Update `audioSources` in `audio-manager.js`:

   ```javascript
   "your-category": {
     track1: "../assets/audio/your-category/track1.mp3",
     track2: "../assets/audio/your-category/track2.mp3",
   }
   ```

4. Add category to the UI in `public/index.html`

## 🎛️ Audio Controls

### Web Interface

- **Play/Pause**: Space bar or click button
- **Stop**: S key or stop button
- **Volume**: Arrow keys or slider
- **Next/Previous**: Track navigation
- **Mini Player**: Floating controls for background playback

### Mobile Interface

- **Touch Controls**: Tap to play/pause
- **Volume Slider**: Adjust playback volume
- **Background Playback**: Continues when app is backgrounded

## 🔍 Troubleshooting

### Common Issues

**Audio not playing:**

- Check file paths in `audio-manager.js`
- Verify audio files exist in correct folders
- Check browser console for errors

**Volume not working:**

- Ensure volume slider is properly initialized
- Check `localStorage` for saved volume settings
- Verify audio context is not suspended

**Background playback issues:**

- Check browser autoplay policies
- Ensure audio context is user-initiated
- Verify mini player is properly implemented

### Performance Optimization

- **File Size**: Keep audio files under 10MB
- **Format**: Use MP3 for better compression
- **Preloading**: Audio files are loaded on demand
- **Memory**: Old audio contexts are properly cleaned up

## 🚀 Future Improvements

### Planned Features

- **Audio Visualizer**: Real-time frequency visualization
- **Custom Playlists**: User-created playlists
- **Audio Effects**: Reverb, echo, and other effects
- **Sleep Timer**: Auto-stop after specified time
- **Audio Mixing**: Layer multiple sounds
- **Streaming Support**: Online audio sources

### Technical Enhancements

- **Web Audio API**: Advanced audio processing
- **Audio Compression**: Better file size optimization
- **Crossfade**: Smooth transitions between tracks
- **Audio Analysis**: BPM and key detection
- **Spatial Audio**: 3D audio positioning

## 📚 Related Documentation

- [Main README](../../README.md) - Project overview
- [Web App Documentation](../../public/README.md) - Web implementation
- [Components Documentation](../../src/components/README.md) - UI components
- [Screens Documentation](../../src/screens/README.md) - App screens

---

**Need help with audio?** Check the [troubleshooting section](#-troubleshooting) or create an issue in the repository.
