# Defocus2Focus 🎯

A comprehensive productivity app that combines focus sessions, break management, music therapy, and gamified rewards to help you stay productive while maintaining mental wellness.

## 🌟 Features

### 🎯 Focus & Productivity
- **Pomodoro Timer**: 25-minute focus sessions with customizable durations
- **Session Cycle Management**: Smart defocus → focus → unlock workflow
- **Progress Tracking**: Visual progress bars and session statistics

### ☕ Break Management
- **Smart Break Types**: Micro (2min), Short (5min), Long (15min) breaks
- **Break Activities**: Guided breathing, stretching, walking, meditation
- **Break Statistics**: Track completion rates and streaks

### 🎵 Music & Relaxation
- **4 Audio Categories**: Nature, Ambient, Focus, Relax
- **Background Playback**: Music continues when switching between features
- **Mini Player**: Floating controls for seamless music management
- **Local Audio Files**: High-quality, offline-capable audio system

### 📝 Task Management
- **To-Do Lists**: Create, edit, delete, and organize tasks
- **Categories & Priorities**: Organize tasks by type and importance
- **Progress Tracking**: Daily completion rates and statistics

### 🏆 Rewards & Gamification
- **Energy Points System**: Earn points for every interaction
- **Badge System**: 6 unlockable badges (Bronze to Legendary)
- **Daily Goals**: Track daily energy point targets
- **Real-time Notifications**: Instant feedback for achievements

## 🏗️ Project Structure

```
Defocus2Focus/
├── src/                          # Source code
│   ├── components/               # React Native components
│   ├── contexts/                 # React contexts
│   ├── screens/                  # App screens
│   ├── services/                 # Business logic services
│   ├── utils/                    # Utility functions
│   └── App.js                    # Main app entry point
├── public/                       # Web app files
│   ├── index.html               # Main web interface
│   └── build-index.html         # Production build
├── assets/                       # Static assets
│   ├── audio/                   # Audio files organized by category
│   │   ├── nature/              # Nature sounds
│   │   ├── ambient/             # Ambient sounds
│   │   ├── focus/               # Focus music
│   │   └── relax/               # Relaxation sounds
│   └── images/                  # Images and icons
├── docs/                        # Documentation
├── scripts/                     # Build and utility scripts
├── tests/                       # Test files
├── ios/                         # iOS native code
├── node_modules/                # Dependencies
├── package.json                 # Project configuration
├── app.json                     # Expo configuration
├── babel.config.js              # Babel configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Defocus2Focus.git
   cd Defocus2Focus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platforms**
   ```bash
   npm run ios      # iOS Simulator
   npm run android  # Android Emulator
   npm run web      # Web browser
   ```

### Web Version
The app also includes a web version accessible at `public/index.html` that provides the same functionality as the mobile app.

## 🎵 Audio System

The app includes a comprehensive audio system with:
- **24 High-quality audio files** across 4 categories
- **Local file playback** for offline functionality
- **Background music support** with mini player controls
- **Volume control** and playlist management

### Audio Categories
- **Nature**: Rain, forest, ocean, thunder, birds, wind
- **Ambient**: Space, city, cafe, library, fireplace, train
- **Focus**: Binaural beats, classical, lofi, piano, white/brown noise
- **Relax**: Meditation, spa, zen, chimes, singing bowls, flute

## 🏆 Rewards System

### Energy Points
Earn energy points for every interaction:
- Focus session started: +2 points
- Break started: +1 point
- Music played: +1 point
- Task completed: +2 points
- Task created: +1 point

### Badge System
Unlock badges as you progress:
- 🥉 **Bronze**: 10 energy points
- 🥈 **Silver**: 25 energy points
- 🥇 **Gold**: 50 energy points
- 💎 **Platinum**: 100 energy points
- 💠 **Diamond**: 250 energy points
- 👑 **Legendary**: 500 energy points

## 🛠️ Development

### Tech Stack
- **React Native** with Expo
- **React Context API** for state management
- **HTML5 Audio API** for web audio
- **Local Storage** for data persistence
- **CSS3** with modern animations

### Key Features
- **Cross-platform**: iOS, Android, and Web
- **Offline-first**: Works without internet connection
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Screen reader support and keyboard navigation

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Deployment

### Web Deployment
The web version is deployed on Netlify and automatically updates when changes are pushed to the main branch.

### Mobile Deployment
- **iOS**: Build and deploy through Expo or Xcode
- **Android**: Build and deploy through Expo or Android Studio

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Audio files sourced from royalty-free libraries
- Icons from various open-source icon sets
- Inspiration from Pomodoro Technique and productivity research

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Made with ❤️ for productivity and mental wellness**
